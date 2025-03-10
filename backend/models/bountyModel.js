const prisma = require('../config/database');

// Create a new bounty record in the database
async function createBounty(data) {
  return prisma.bounty.create({ data });
}

// Get a bounty by ID
async function getBountyById(id) {
  return prisma.bounty.findUnique({ where: { id: id } });
}

// Mark a bounty as claimed by a developer
async function markBountyClaimed(id, devId) {
  return prisma.bounty.update({
    where: { id: id },
    data: {
      claimedBy: devId,
      status: 'CLAIMED'
    },
    include: { owner: true }  // include owner User details (to access owner.token)
  });
}

// Mark a bounty as completed (after approval)
async function markBountyCompleted(id, transactionId) {
  return prisma.bounty.update({
    where: { id: id },
    data: { 
      status: 'COMPLETED',
      completedAt: new Date(),
      transactionId: transactionId
    }
  });
}

// Mark a bounty as cancelled
async function cancelBounty(id) {
  return prisma.bounty.update({
    where: { id: id },
    data: { status: 'CANCELLED' }
  });
}

// Get all open (unclaimed) bounties
async function getOpenBounties() {
  return prisma.bounty.findMany({
    where: { status: 'OPEN' }
  });
}

// Get all bounties including completed/cancelled ones
async function getAllBounties() {
  return prisma.bounty.findMany({
    include: {
      owner: { select: { name: true, githubUsername: true } },
      claimer: { select: { name: true, githubUsername: true } }
    }
  });
}

// Get bounties associated with a user (posted and claimed by the user)
async function getUserBounties(userId) {
  // Bounties posted by the user (open or claimed, exclude completed/cancelled)
  const posted = await prisma.bounty.findMany({
    where: {
      createdBy: userId,
      NOT: { status: { in: ['COMPLETED', 'CANCELLED'] } }
    },
    include: { claimer: { select: { githubUsername: true } } }
  });
  // Bounties claimed by the user (still active)
  const claimed = await prisma.bounty.findMany({
    where: {
      claimedBy: userId,
      NOT: { status: { in: ['COMPLETED', 'CANCELLED'] } }
    },
    include: { owner: { select: { githubUsername: true } } }
  });
  return { posted, claimed };
}

// Get a bounty by repository and issue number
async function getBountyByIssue(repoOwner, repoName, issueNumber) {
  return prisma.bounty.findFirst({
    where: {
      repoOwner: repoOwner,
      repoName: repoName,
      issueNumber: parseInt(issueNumber, 10)
    }
  });
}

module.exports = {
  createBounty,
  getBountyById,
  markBountyClaimed,
  markBountyCompleted,
  cancelBounty,
  getOpenBounties,
  getUserBounties,
  getAllBounties,
  getBountyByIssue
};
