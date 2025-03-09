import React, { useState, useEffect } from 'react';
import { createBounty, fetchUserRepos, fetchRepoIssues } from '../api/bounty';
import { getCurrentUser } from '../api/auth';
import { useRouter } from 'next/router';
import Select from 'react-select';

const CreateBountyForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    repoOwner: '',
    repoName: '',
    issueNumber: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Fetch user data and repositories on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get user profile from GitHub
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        // Get user profile using our dedicated service
        const user = await getCurrentUser();
        if (user) {
          setUserData(user);
          setForm(prev => ({ ...prev, repoOwner: user.username }));
          
          // After we have user data, fetch the repositories
          try {
            const reposData = await fetchUserRepos();
            if (Array.isArray(reposData)) {
              setRepositories(reposData);
            } else {
              console.warn('Repositories data is not an array:', reposData);
              setRepositories([]);
            }
          } catch (repoErr) {
            console.error('Error fetching repositories:', repoErr);
            // Non-blocking error for repos
          }
        } else {
          setError('Could not retrieve user profile. Please try logging in again.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch issues when a repository is selected
  const handleRepoChange = async (selectedOption) => {
    setSelectedRepo(selectedOption);
    setSelectedIssue(null);
    setIssues([]);
    
    // Get the full repository data from the selected option
    const selectedRepoData = selectedOption.data;
    
    // Use the explicit owner property if available, otherwise fallback to parsing full_name
    const repoOwner = selectedRepoData.owner || selectedRepoData.full_name.split('/')[0];
    
    setForm(prev => ({ 
      ...prev, 
      repoName: selectedRepoData.name,
      repoOwner: repoOwner,
      issueNumber: '' 
    }));
    
    try {
      setLoading(true);
      
      console.log('Fetching issues for:', repoOwner, selectedRepoData.name);
      
      const issuesData = await fetchRepoIssues(repoOwner, selectedRepoData.name);
      console.log('Issues data received:', issuesData);
      
      if (Array.isArray(issuesData)) {
        setIssues(issuesData);
      } else {
        console.warn('Issues data is not an array:', issuesData);
        setIssues([]);
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to fetch issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update form when an issue is selected
  const handleIssueChange = (selectedOption) => {
    setSelectedIssue(selectedOption);
    setForm(prev => ({ ...prev, issueNumber: selectedOption.value }));
  };

  const handleAmountChange = (e) => {
    setForm(prev => ({ ...prev, amount: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.repoOwner || !form.repoName || !form.issueNumber || !form.amount) {
      setError('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      await createBounty(form);
      // On success, go back to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating bounty:', err);
      // Get more detailed error information
      const errorDetails = err.response?.data?.details;
      const errorMessage = err.response?.data?.error || 'Failed to create bounty';
      
      setError(errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Format repositories for the Select component
  const repoOptions = repositories.map(repo => ({
    value: repo.name,
    label: repo.full_name,
    data: repo
  }));

  // Format issues for the Select component
  const issueOptions = issues.map(issue => ({
    value: issue.number.toString(),
    label: `#${issue.number}: ${issue.title}`,
    data: issue
  }));

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create a Bounty</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      
      {loading && !userData ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error && !userData ? (
        <div className="text-center p-6 bg-red-50 rounded-lg mb-4">
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <p className="text-gray-700 mb-4">Unable to load your GitHub profile data.</p>
          <button 
            onClick={() => router.push('/')} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block font-medium mb-1">GitHub Username</label>
            <input 
              type="text" 
              value={userData?.username || ''}
              className="w-full px-3 py-2 border rounded bg-gray-100"
              disabled 
              title="Auto-filled with your GitHub username"
            />
            <p className="text-xs text-gray-500 mt-1">This is your GitHub username</p>
          </div>
          
          <div className="mb-3">
            <label className="block font-medium mb-1">Select Repository</label>
            <Select
              options={repoOptions}
              value={selectedRepo}
              onChange={handleRepoChange}
              isSearchable
              placeholder="Search your repositories..."
              className="react-select-container"
              classNamePrefix="react-select"
              isDisabled={loading || repositories.length === 0}
            />
            {repositories.length === 0 && !loading && (
              <p className="text-xs text-red-500 mt-1">No repositories found. Make sure you have access to repositories.</p>
            )}
          </div>
          
          <div className="mb-3">
            <label className="block font-medium mb-1">Select Issue</label>
            <Select
              options={issueOptions}
              value={selectedIssue}
              onChange={handleIssueChange}
              isSearchable
              placeholder={selectedRepo ? "Search issues..." : "First select a repository"}
              className="react-select-container"
              classNamePrefix="react-select"
              isDisabled={loading || !selectedRepo || issues.length === 0}
            />
            {selectedRepo && issues.length === 0 && !loading && (
              <p className="text-xs text-red-500 mt-1">No open issues found in this repository.</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block font-medium mb-1">Bounty Amount (USD)</label>
            <input 
              type="number" 
              name="amount" 
              required 
              value={form.amount} 
              onChange={handleAmountChange}
              className="w-full px-3 py-2 border rounded"
              min="1"
              step="0.01"
            />
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-2 rounded ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={loading || !form.repoOwner || !form.repoName || !form.issueNumber || !form.amount}
          >
            {loading ? 'Creating...' : 'Create Bounty'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateBountyForm;
