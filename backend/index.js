require('dotenv').config();  // Load environment variables from .env

const express = require('express');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bountyRoutes = require('./routes/bountyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/api', bountyRoutes);

// Health check (optional)
app.get('/', (req, res) => {
  res.send('GitHub Bounty Platform API running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is listening on port ${PORT}`);
});
