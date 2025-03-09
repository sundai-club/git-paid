const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const { findOrCreateUser } = require('../models/userModel');

// Configure Passport GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create the user in our database
      const user = await findOrCreateUser(profile, accessToken);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// (If using sessions, we would add serializeUser/deserializeUser, but we use JWT tokens for auth)

// Controller to handle OAuth callback and JWT issuance
function githubCallback(req, res) {
  // Passport attaches authenticated user to req.user
  const user = req.user;
  // Create a JWT containing the user ID and username
  const payload = { id: user.id, username: user.githubUsername };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  // Redirect to frontend with JWT as a query param
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
}

module.exports = { githubCallback };
