const jwt = require('jsonwebtoken');

// Middleware to protect routes (checks for valid JWT in Authorization header)
function ensureAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info (from token payload) to request for use in controllers
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { ensureAuth };
