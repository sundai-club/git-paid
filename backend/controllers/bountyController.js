const axios = require('axios');
const {
  createBounty: createBountyModel,
  getBountyById,
  markBountyClaimed,
  markBountyCompleted,
  cancelBounty: cancelBountyModel,
  getOpenBounties,
  getUserBounties
} = require('../models/bountyModel');
const { getUserById } = require('../models/userModel');
const radius = require('../config/radius');

// Create a new bounty (by repository owner)
async function createBounty(req, res) {
  try {
    const { repo_owner, repo_name, issue_number, amount } = req.body;
    console.log('Received bounty creation request:', { repo_owner, repo_name, issue_number, amount });
    
    const userId = req.user.id;
    // Fetch the creating user's details (for GitHub token and Radius ID)
    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Verify the GitHub issue exists and is open
    const issueUrl = `https://api.github.com/repos/${repo_owner}/${repo_name}/issues/${issue_number}`;
    console.log('Verifying GitHub issue:', issueUrl);
    
    try {
      const ghResponse = await axios.get(issueUrl, {
        headers: { Authorization: `token ${user.token}` }
      });
      
      const issue = ghResponse.data;
      console.log('Issue state:', issue.state);
      
      if (!issue || issue.state !== 'open') {
        return res.status(400).json({ error: 'Issue is not open or not found' });
      }
      
      // Lock funds in escrow via Radius API
      const escrowId = await radius.createEscrow(userId, amount);
      
      // Create bounty record in the database
      const bounty = await createBountyModel({
        repoOwner: repo_owner,
        repoName: repo_name,
        issueNumber: parseInt(issue_number),
        amount: parseFloat(amount),
        currency: 'USD',
        status: 'OPEN',
        escrowId: escrowId,
        createdBy: userId
      });
      
      return res.status(201).json({ bounty });
    } catch (ghError) {
      console.error('GitHub API error:', ghError.response?.status, ghError.response?.data);
      return res.status(400).json({ 
        error: 'Issue not found or access denied',
        details: ghError.response?.data?.message || ghError.message
      });
    }
  } catch (err) {
    console.error('Error creating bounty:', err.message);
    // Handle known errors (e.g., issue not found or permission denied)
    if (err.response) {
      return res.status(400).json({ 
        error: 'Issue not found or access denied',
        details: err.response?.data?.message || err.message
      });
    }
    return res.status(500).json({ error: 'Failed to create bounty' });
  }
}

// Claim an open bounty (by a developer)
async function claimBounty(req, res) {
  try {
    const { bounty_id } = req.body;
    const userId = req.user.id;  // current user (developer)
    // Retrieve the bounty
    const bounty = await getBountyById(bounty_id);
    if (!bounty) {
      return res.status(404).json({ error: 'Bounty not found' });
    }
    if (bounty.status !== 'OPEN') {
      return res.status(400).json({ error: 'Bounty is not available for claiming' });
    }
    if (bounty.createdBy === userId) {
      return res.status(400).json({ error: 'You cannot claim your own bounty' });
    }
    // Mark the bounty as claimed by this user
    const updatedBounty = await markBountyClaimed(bounty_id, userId);
    // Post a comment on the GitHub issue to indicate the claim (using repo owner's token)
    try {
      const owner = updatedBounty.owner;  // owner includes the repo owner's user info and token
      const devUsername = req.user.username;
      const commentBody = {
        body: `Bounty claimed by @${devUsername} via the bounty platform.`
      };
      await axios.post(
        `https://api.github.com/repos/${updatedBounty.repoOwner}/${updatedBounty.repoName}/issues/${updatedBounty.issueNumber}/comments`,
        commentBody,
        { headers: { Authorization: `token ${owner.token}` } }
      );
    } catch (err) {
      console.error('Failed to post GitHub comment:', err.response?.data || err.message);
      // Continue even if comment fails
    }
    return res.status(200).json({ bounty: updatedBounty });
  } catch (err) {
    console.error('Error claiming bounty:', err.message);
    return res.status(500).json({ error: 'Failed to claim bounty' });
  }
}

// Complete a bounty (approve fix and release payment by repo owner)
async function completeBounty(req, res) {
  try {
    const { bounty_id } = req.body;
    const userId = req.user.id;  // current user (should be the bounty creator)
    const bounty = await getBountyById(bounty_id);
    if (!bounty) {
      return res.status(404).json({ error: 'Bounty not found' });
    }
    if (bounty.createdBy !== userId) {
      return res.status(403).json({ error: 'Only the bounty creator can complete it' });
    }
    if (bounty.status !== 'CLAIMED') {
      return res.status(400).json({ error: 'Bounty is not in a state to complete' });
    }
    // Verify the GitHub issue is closed (meaning the fix was merged)
    const owner = await getUserById(userId);
    const issueUrl = `https://api.github.com/repos/${bounty.repoOwner}/${bounty.repoName}/issues/${bounty.issueNumber}`;
    const ghResponse = await axios.get(issueUrl, {
      headers: { Authorization: `token ${owner.token}` }
    });
    const issue = ghResponse.data;
    if (!issue || issue.state !== 'closed') {
      return res.status(400).json({ error: 'Issue is not closed yet, cannot complete bounty' });
    }
    // Release escrowed funds to the developer via Radius
    await radius.releaseEscrow(bounty.escrowId, bounty.claimedBy);
    // Update bounty status to completed
    await markBountyCompleted(bounty_id);
    return res.status(200).json({ message: 'Bounty completed and payment released' });
  } catch (err) {
    console.error('Error completing bounty:', err.message);
    return res.status(500).json({ error: 'Failed to complete bounty' });
  }
}

// Cancel a bounty (refund to owner)
async function cancelBounty(req, res) {
  try {
    const { bounty_id } = req.body;
    const userId = req.user.id;
    const bounty = await getBountyById(bounty_id);
    if (!bounty) {
      return res.status(404).json({ error: 'Bounty not found' });
    }
    if (bounty.createdBy !== userId) {
      return res.status(403).json({ error: 'Only the bounty creator can cancel it' });
    }
    if (bounty.status === 'COMPLETED' || bounty.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Bounty cannot be cancelled at this stage' });
    }
    // Refund the escrowed funds via Radius
    await radius.refundEscrow(bounty.escrowId, userId);
    // Update bounty status to cancelled
    await cancelBountyModel(bounty_id);
    // Optionally, comment on GitHub issue that the bounty was cancelled
    try {
      const owner = await getUserById(userId);
      await axios.post(
        `https://api.github.com/repos/${bounty.repoOwner}/${bounty.repoName}/issues/${bounty.issueNumber}/comments`,
        { body: 'This bounty has been cancelled by the owner.' },
        { headers: { Authorization: `token ${owner.token}` } }
      );
    } catch (err) {
      console.error('Failed to post cancellation comment:', err.message);
    }
    return res.status(200).json({ message: 'Bounty cancelled and funds refunded' });
  } catch (err) {
    console.error('Error cancelling bounty:', err.message);
    return res.status(500).json({ error: 'Failed to cancel bounty' });
  }
}

// List all open bounties (publicly accessible)
async function listOpenBounties(req, res) {
  try {
    const bounties = await getOpenBounties();
    return res.status(200).json({ bounties });
  } catch (err) {
    console.error('Error fetching open bounties:', err.message);
    return res.status(500).json({ error: 'Failed to fetch open bounties' });
  }
}

// List bounties associated with the logged-in user (posted and claimed)
async function listUserBounties(req, res) {
  try {
    const userId = req.user.id;
    const data = await getUserBounties(userId);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching user bounties:', err.message);
    return res.status(500).json({ error: 'Failed to fetch user bounties' });
  }
}

module.exports = {
  createBounty,
  claimBounty,
  completeBounty,
  cancelBounty,
  listOpenBounties,
  listUserBounties
};
