import React, { useEffect, useState } from 'react';
import { fetchOpenBounties, claimBounty } from '../api/bounty';
import BountyList from './BountyList';

const ClaimBounty = () => {
  const [bounties, setBounties] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load open bounties on component mount
    const loadBounties = async () => {
      setLoading(true);
      try {
        const openBounties = await fetchOpenBounties();
        setBounties(openBounties);
      } catch (err) {
        console.error('Failed to fetch open bounties');
        setError('Failed to load open bounties');
      } finally {
        setLoading(false);
      }
    };
    loadBounties();
  }, []);

  const handleClaim = async (bountyId) => {
    setError('');
    setClaimingId(bountyId);
    try {
      await claimBounty(bountyId);
      // Remove the claimed bounty from the list
      setBounties(prev => prev.filter(b => b.id !== bountyId));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out';
      notification.textContent = 'Bounty claimed successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to claim bounty');
    } finally {
      setClaimingId(null);
    }
  };

  // Filter bounties based on search term
  const filteredBounties = searchTerm 
    ? bounties.filter(bounty => {
        const searchString = `${bounty.repoOwner || ''}/${bounty.repoName || ''} #${bounty.issueNumber || ''} ${bounty.createdByUsername || ''}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      })
    : bounties;

  return (
    <div>
      <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-[#334155] mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Open Bounties</h2>
        <p className="text-gray-400">Browse and claim available bounties from the community</p>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search bounties by repo, issue, or username..."
          className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]"></div>
        </div>
      ) : bounties.length === 0 ? (
        <div className="bg-[#0f172a] p-8 rounded-xl text-center border border-[#334155]">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-300 text-xl mb-6">No open bounties available at the moment.</p>
        </div>
      ) : (
        <div>
          {/* Stats */}
          <div className="mb-6 bg-[#1e293b] rounded-xl p-4 border border-[#334155] flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-sm">Available Bounties: </span>
              <span className="text-white font-semibold">{filteredBounties.length}</span>
            </div>
          </div>
          
          <BountyList 
            bounties={filteredBounties} 
            actionName="Claim" 
            onAction={handleClaim} 
            actionLoading={claimingId}
          />
          
          {/* Empty search results */}
          {filteredBounties.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-[#1e293b] rounded-xl border border-[#334155]">
              <p className="text-gray-400">No bounties match your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimBounty;
