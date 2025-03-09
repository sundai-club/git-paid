import React, { useEffect, useState } from 'react';
import { fetchOpenBounties, claimBounty } from '../api/bounty';
import BountyList from './BountyList';

const ClaimBounty = () => {
  const [bounties, setBounties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load open bounties on component mount
    const loadBounties = async () => {
      try {
        const openBounties = await fetchOpenBounties();
        setBounties(openBounties);
      } catch (err) {
        console.error('Failed to fetch open bounties');
      }
    };
    loadBounties();
  }, []);

  const handleClaim = async (bountyId) => {
    setError('');
    try {
      await claimBounty(bountyId);
      // Remove the claimed bounty from the list
      setBounties(prev => prev.filter(b => b.id !== bountyId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to claim bounty');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Open Bounties</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <BountyList bounties={bounties} actionName="Claim" onAction={handleClaim} />
    </div>
  );
};

export default ClaimBounty;
