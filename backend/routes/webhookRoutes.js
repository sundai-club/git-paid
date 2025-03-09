const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getBountyByIssue, markBountyCompleted } = require('../models/bountyModel');
const { releaseEscrow } = require('../config/radius');
const { getUserById } = require('../models/userModel');

// GitHub webhook secret verification middleware
function verifyGitHubWebhook(req, res, next) {
  console.log('===== WEBHOOK REQUEST RECEIVED =====');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body (sample):', JSON.stringify(req.body).substring(0, 500) + '...');
  
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.log('ERROR: No signature found in request');
    return res.status(401).json({ error: 'No signature found in request' });
  }

  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('ERROR: GITHUB_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  console.log('Webhook secret found, verifying signature...');
  
  // Create HMAC
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const rawBody = JSON.stringify(req.body);
  hmac.update(rawBody);
  const computedSignature = `sha256=${hmac.digest('hex')}`;

  console.log('Raw body length:', rawBody.length);
  console.log('Expected signature:', signature);
  console.log('Computed signature:', computedSignature);

  // Compare signatures
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
      console.log('ERROR: Signature validation failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    console.log('Signature verification successful');
  } catch (error) {
    console.error('ERROR during signature comparison:', error);
    return res.status(401).json({ error: 'Signature verification error' });
  }

  next();
}

// GitHub webhook for issue events
router.post('/github', verifyGitHubWebhook, async (req, res) => {
  try {
    console.log('===== PROCESSING WEBHOOK =====');
    // Check if this is an issue event
    if (req.headers['x-github-event'] !== 'issues') {
      console.log(`Ignoring non-issue event: ${req.headers['x-github-event']}`);
      return res.status(200).json({ message: 'Not an issue event, ignoring' });
    }

    const { action, issue, repository } = req.body;
    console.log(`Received GitHub webhook: ${action} issue #${issue.number} in ${repository.full_name}`);
    console.log('Issue details:', JSON.stringify({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state,
      locked: issue.locked,
      closed_at: issue.closed_at,
      user: issue.user?.login
    }, null, 2));
    console.log('Repository details:', JSON.stringify({
      id: repository.id,
      name: repository.name,
      full_name: repository.full_name,
      owner: repository.owner?.login
    }, null, 2));

    // We only care about issues being closed
    if (action !== 'closed') {
      console.log(`Ignoring '${action}' action`);
      return res.status(200).json({ message: 'Not a closed issue event, ignoring' });
    }

    // Find if there's a bounty for this issue
    const repoOwner = repository.owner.login;
    const repoName = repository.name;
    const issueNumber = issue.number;

    console.log(`Looking for bounty for issue #${issueNumber} in ${repoOwner}/${repoName}`);
    
    const bounty = await getBountyByIssue(repoOwner, repoName, issueNumber);
    if (!bounty) {
      console.log('No bounty found for this issue');
      return res.status(200).json({ message: 'No bounty found for this issue' });
    }

    console.log('Found bounty:', JSON.stringify(bounty, null, 2));

    if (bounty.status !== 'CLAIMED') {
      console.log(`Bounty is in ${bounty.status} state, not releasing funds`);
      return res.status(200).json({ message: `Bounty is in ${bounty.status} state, not releasing funds` });
    }

    // Get the claimer's user ID
    const claimerId = bounty.claimedBy;
    if (!claimerId) {
      console.log('Bounty has no claimer, cannot release funds');
      return res.status(200).json({ message: 'Bounty has no claimer, cannot release funds' });
    }

    console.log(`Getting user details for claimer ID: ${claimerId}`);
    const claimer = await getUserById(claimerId);
    if (!claimer) {
      console.log('Claimer not found, cannot release funds');
      return res.status(200).json({ message: 'Claimer not found, cannot release funds' });
    }

    console.log(`Claimer found: ${claimer.username}`);
    console.log(`Releasing escrow ${bounty.escrowId} to user ${claimerId}`);
    
    // Release the funds to the claimer
    try {
      const releaseResult = await releaseEscrow(bounty.escrowId, claimerId);
      console.log('Escrow release result:', JSON.stringify(releaseResult, null, 2));
      
      // Mark the bounty as completed
      console.log(`Marking bounty ${bounty.id} as completed with transaction: ${releaseResult.transaction}`);
      await markBountyCompleted(bounty.id, releaseResult.transaction);
      console.log('Bounty successfully marked as completed');

      return res.status(200).json({ 
        message: 'Funds released successfully', 
        bountyId: bounty.id,
        transaction: releaseResult.transaction 
      });
    } catch (error) {
      console.error('Error releasing escrow:', error);
      return res.status(500).json({ error: 'Error releasing escrow: ' + error.message });
    }
  } catch (error) {
    console.error('Error handling GitHub webhook:', error);
    console.error(error.stack);
    return res.status(500).json({ error: 'Error processing webhook: ' + error.message });
  }
});

module.exports = router;
