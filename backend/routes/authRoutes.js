const express = require('express');
const passport = require('passport');
const router = express.Router();
const { githubCallback } = require('../controllers/authController');  // configure GitHub OAuth

// GitHub OAuth login initiation
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'public_repo'] }));

// GitHub OAuth callback URL
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }), githubCallback);

module.exports = router;
