import axios from 'axios';

// Axios instance to communicate with backend API
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE
});

// Attach JWT token to all requests if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all open bounties (no auth needed)
export async function fetchOpenBounties() {
  const res = await API.get('/api/bounties/open');
  return res.data.bounties;
}

// Fetch bounties associated with logged-in user (requires auth)
export async function fetchUserBounties() {
  const res = await API.get('/api/bounties/user');
  return res.data;
}

// Create a new bounty
export async function createBounty(data) {
  // Convert from camelCase to snake_case for backend compatibility
  const backendData = {
    repo_owner: data.repoOwner,
    repo_name: data.repoName,
    issue_number: data.issueNumber,
    amount: data.amount
  };
  
  console.log('Sending bounty creation request with data:', backendData);
  return API.post('/api/bounty', backendData);
}

// Claim a bounty by ID
export async function claimBounty(bountyId) {
  return API.post('/api/bounty/claim', { bounty_id: bountyId });
}

// Complete a bounty by ID (approve and release payment)
export async function completeBounty(bountyId) {
  return API.post('/api/bounty/complete', { bounty_id: bountyId });
}

// Fetch user's repositories from GitHub
export async function fetchUserRepos() {
  try {
    const res = await API.get('/api/github/repos');
    return res.data.repos;
  } catch (error) {
    console.error('Error fetching repositories:', error.response?.data || error.message);
    return [];
  }
}

// Fetch issues from a specific repository
export async function fetchRepoIssues(repoOwner, repoName) {
  try {
    const res = await API.get(`/api/github/issues?owner=${repoOwner}&repo=${repoName}`);
    return res.data.issues;
  } catch (error) {
    console.error('Error fetching issues:', error.response?.data || error.message);
    return [];
  }
}
