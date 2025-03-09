const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/authMiddleware');
const { 
  createBounty,
  claimBounty,
  completeBounty,
  cancelBounty,
  listOpenBounties,
  listUserBounties,
  listAllBounties
} = require('../controllers/bountyController');
const { getUserById } = require('../models/userModel');
const axios = require('axios');

// Public route: list all open bounties
router.get('/bounties/open', listOpenBounties);

// Protected route: list bounties for logged-in user (posted and claimed)
router.get('/bounties/user', ensureAuth, listUserBounties);

// Admin route: list all bounties (including completed and cancelled)
router.get('/bounties/all', ensureAuth, listAllBounties);

// Protected route: create a new bounty on a GitHub issue
router.post('/bounty', ensureAuth, createBounty);

// Protected route: claim an open bounty
router.post('/bounty/:bountyId/claim', ensureAuth, claimBounty);

// Protected route: mark a bounty as completed (approve and release payment)
router.post('/bounty/:bountyId/complete', ensureAuth, completeBounty);

// Protected route: cancel a bounty (refund escrow)
router.post('/bounty/:bountyId/cancel', ensureAuth, cancelBounty);

// Routes for GitHub API integration
router.get('/github/repos', ensureAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || !user.token) {
      return res.status(401).json({ error: 'User not authenticated with GitHub' });
    }
    
    // Fetch user's repositories from GitHub API
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${user.token}` },
      params: { sort: 'updated', per_page: 100 }
    });
    
    // Extract relevant data
    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner.login,  
      description: repo.description,
      stars: repo.stargazers_count,
      open_issues: repo.open_issues_count
    }));
    
    console.log('Repository data sample:', repos.length > 0 ? repos[0] : 'No repos found');
    
    return res.json({ repos });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

router.get('/github/issues', ensureAuth, async (req, res) => {
  try {
    const { owner, repo } = req.query;
    console.log('Issues request received for:', { owner, repo });
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo parameters are required' });
    }
    
    const user = await getUserById(req.user.id);
    if (!user || !user.token) {
      return res.status(401).json({ error: 'User not authenticated with GitHub' });
    }
    
    console.log(`Fetching issues for ${owner}/${repo} using GitHub token`);
    
    // Fetch open issues from the specified repository
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      headers: { Authorization: `token ${user.token}` },
      params: { state: 'open', per_page: 100 }
    });
    
    console.log(`Found ${response.data.length} items from GitHub API`);
    
    // Extract relevant data
    const issues = response.data
      .filter(issue => !issue.pull_request) // Filter out PRs, only include actual issues
      .map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body?.substring(0, 100) + (issue.body?.length > 100 ? '...' : '') || '',
        created_at: issue.created_at,
        labels: issue.labels.map(label => label.name)
      }));
    
    console.log(`Returning ${issues.length} issues after filtering out PRs`);
    return res.json({ issues });
  } catch (error) {
    console.error('Error fetching issues:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

module.exports = router;
