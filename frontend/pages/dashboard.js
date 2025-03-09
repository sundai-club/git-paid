import React, { useEffect, useState } from 'react';
import { fetchUserBounties } from '../api/bounty';
import BountyList from '../components/BountyList';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const [userBounties, setUserBounties] = useState({ posted: [], claimed: [] });
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Require authentication to view dashboard
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    // Load stored GitHub username for greeting
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    // Fetch bounties related to the user
    const loadBounties = async () => {
      try {
        const data = await fetchUserBounties();
        setUserBounties(data);
      } catch (err) {
        console.error('Failed to load user bounties');
      }
    };
    loadBounties();
  }, [router]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Dashboard {username && <span className="text-xl font-normal">({username})</span>}
        </h1>
        <div>
          <a href="/create-bounty" className="mr-4 text-blue-600 hover:underline">Create Bounty</a>
          <a href="/claim-bounty" className="mr-4 text-blue-600 hover:underline">Browse Bounties</a>
          <a href="/review" className="mr-4 text-blue-600 hover:underline">Review</a>
          <button 
            onClick={() => { localStorage.clear(); router.push('/'); }} 
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Bounties You Posted</h2>
        <BountyList bounties={userBounties.posted} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Bounties You Claimed</h2>
        <BountyList bounties={userBounties.claimed} />
      </div>
    </div>
  );
};

export default Dashboard;
