const jwt = require('jsonwebtoken');

// Middleware to protect routes (checks for valid JWT in Authorization header)
function ensureAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Add more detailed logging for debugging
  console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized - No authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    console.log('Attempting to verify token with secret');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.username);
    
    // Attach user info (from token payload) to request for use in controllers
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token - ' + err.message });
  }
}

module.exports = { ensureAuth };
