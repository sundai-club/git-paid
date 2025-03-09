import React, { useEffect, useState } from 'react';
import { fetchUserBounties, completeBounty } from '../api/bounty';
import { useRouter } from 'next/router';
import BountyList from '../components/BountyList';

const Review = () => {
  const router = useRouter();
  const [claimedBounties, setClaimedBounties] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/');
      return;
    }
    // Load bounties posted by user that are currently claimed (pending approval)
    const loadPending = async () => {
      try {
        const data = await fetchUserBounties();
        const pending = data.posted.filter(b => b.status === 'CLAIMED');
        setClaimedBounties(pending);
      } catch {
        console.error('Failed to load claimed bounties');
      }
    };
    loadPending();
  }, [router]);

  const handleComplete = async (bountyId) => {
    setError('');
    setMessage('');
    try {
      await completeBounty(bountyId);
      setMessage('Bounty marked as completed and paid out.');
      // Remove bounty from list after completion
      setClaimedBounties(prev => prev.filter(b => b.id !== bountyId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete bounty');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Review Bounty Submissions</h2>
      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <BountyList bounties={claimedBounties} actionName="Release" onAction={handleComplete} />
    </div>
  );
};

export default Review;
