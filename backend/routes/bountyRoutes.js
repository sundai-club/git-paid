const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/authMiddleware');
const {
  createBounty,
  claimBounty,
  completeBounty,
  cancelBounty,
  listOpenBounties,
  listUserBounties
} = require('../controllers/bountyController');

// Public route: list all open bounties
router.get('/bounties/open', listOpenBounties);

// Protected route: list bounties for logged-in user (posted and claimed)
router.get('/bounties/user', ensureAuth, listUserBounties);

// Protected route: create a new bounty on a GitHub issue
router.post('/bounty', ensureAuth, createBounty);

// Protected route: claim an open bounty
router.post('/bounty/claim', ensureAuth, claimBounty);

// Protected route: mark a bounty as completed (approve and release payment)
router.post('/bounty/complete', ensureAuth, completeBounty);

// Protected route: cancel a bounty (refund escrow)
router.post('/bounty/cancel', ensureAuth, cancelBounty);

module.exports = router;
