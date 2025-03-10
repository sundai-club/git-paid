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
        // Client-side only code
        if (typeof window === 'undefined') {
          return;
        }
        
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

  // Custom styles for React Select to match dark theme
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : null,
      '&:hover': {
        borderColor: '#3b82f6'
      },
      padding: '2px'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
          ? '#334155' 
          : '#1e293b',
      color: state.isSelected ? 'white' : '#e2e8f0',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#334155'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#e2e8f0'
    }),
    input: (provided) => ({
      ...provided,
      color: '#e2e8f0'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#334155'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#94a3b8',
      '&:hover': {
        color: '#e2e8f0'
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#94a3b8',
      '&:hover': {
        color: '#e2e8f0'
      }
    })
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#1e293b] rounded-xl shadow-lg border border-[#334155]">
      <h2 className="text-2xl font-semibold mb-6 text-white">Create a Bounty</h2>
      {error && (
        <div className="p-4 mb-6 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {loading && !userData ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3b82f6]"></div>
        </div>
      ) : error && !userData ? (
        <div className="text-center p-6 bg-[#0f172a] rounded-lg mb-6 border border-[#334155]">
          <p className="text-red-400 font-semibold mb-3">{error}</p>
          <p className="text-gray-400 mb-4">Unable to load your GitHub profile data.</p>
          <button 
            onClick={() => router.push('/')} 
            className="px-4 py-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-lg hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all duration-300 shadow-md"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#0f172a] rounded-lg p-6 border border-[#334155]">
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-300">GitHub Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={userData?.username || ''}
                  className="w-full pl-10 px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  disabled 
                  title="Auto-filled with your GitHub username"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">This is your GitHub username</p>
            </div>
            
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-300">Select Repository</label>
              <Select
                options={repoOptions}
                value={selectedRepo}
                onChange={handleRepoChange}
                isSearchable
                placeholder="Search your repositories..."
                styles={customSelectStyles}
                isDisabled={loading || repositories.length === 0}
              />
              {repositories.length === 0 && !loading && (
                <p className="text-xs text-red-400 mt-2">No repositories found. Make sure you have access to repositories.</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-300">Select Issue</label>
              <Select
                options={issueOptions}
                value={selectedIssue}
                onChange={handleIssueChange}
                isSearchable
                placeholder={selectedRepo ? "Search issues..." : "First select a repository"}
                styles={customSelectStyles}
                isDisabled={loading || !selectedRepo || issues.length === 0}
              />
              {selectedRepo && issues.length === 0 && !loading && (
                <p className="text-xs text-red-400 mt-2">No open issues found in this repository.</p>
              )}
            </div>
          </div>
          
          <div className="bg-[#0f172a] rounded-lg p-6 border border-[#334155]">
            <div className="mb-4">
              <label className="block font-medium mb-2 text-gray-300">Bounty Amount (ETH)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">Ξ</span>
                </div>
                <input 
                  type="number" 
                  name="amount" 
                  required 
                  value={form.amount} 
                  onChange={handleAmountChange}
                  className="w-full pl-10 px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  min="0.000001"
                  step="any"
                  placeholder="Enter any amount greater than 0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter the amount in ETH (e.g. 0.1, 1.5, etc.)</p>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg ${loading || !form.repoOwner || !form.repoName || !form.issueNumber || !form.amount 
              ? 'bg-[#3b82f6] bg-opacity-50 cursor-not-allowed text-white' 
              : 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white'}`}
            disabled={loading || !form.repoOwner || !form.repoName || !form.issueNumber || !form.amount}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : 'Create Bounty'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateBountyForm;
