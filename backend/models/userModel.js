const prisma = require('../config/database');

// Find or create a user using GitHub OAuth profile data
async function findOrCreateUser(profile, token) {
  const githubId = profile.id.toString();
  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { githubId } });
  if (!user) {
    // Create new user in DB
    user = await prisma.user.create({
      data: {
        githubId: githubId,
        githubUsername: profile.username,
        name: profile.displayName || profile.username,
        token: token
      }
    });
    // (In a real app, you might create a Radius account for the user here)
  } else {
    // Update user token and username on each login
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        githubUsername: profile.username,
        token: token
      }
    });
  }
  return user;
}

// Get a user by ID
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id: id } });
}

module.exports = { findOrCreateUser, getUserById };
