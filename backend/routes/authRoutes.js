const express = require('express');
const passport = require('passport');
const router = express.Router();
const { githubCallback } = require('../controllers/authController');  // configure GitHub OAuth
const { ensureAuth } = require('../middleware/authMiddleware');
const { getUserById } = require('../models/userModel');

// GitHub OAuth login initiation
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'public_repo'] }));

// GitHub OAuth callback URL
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }), githubCallback);

// Get current user profile
router.get('/user-profile', ensureAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return only necessary user data (avoid sending sensitive information)
    res.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Debug endpoint to verify authentication
router.get('/debug-token', ensureAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user.id,
      username: req.user.username
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
