import React, { useEffect, useState } from 'react';
import { fetchUserBounties } from '../api/bounty';
import BountyList from '../components/BountyList';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const [userBounties, setUserBounties] = useState({ posted: [], claimed: [] });
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
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
    }
    // Fetch bounties related to the user
    const loadBounties = async () => {
      try {
        setLoading(true);
        const data = await fetchUserBounties();
        setUserBounties(data);
      } catch (err) {
        console.error('Failed to load user bounties');
      } finally {
        setLoading(false);
      }
    };
    loadBounties();
  }, [router]);

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-[#334155]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome back{username ? `, ${username}` : ''}
              </h1>
              <p className="text-gray-400">
                Manage your bounties and track your contributions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a 
                href="/create-bounty" 
                className="px-4 py-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-lg font-medium text-sm hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all duration-300 shadow-md flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Bounty
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Posted Bounties</h3>
              <p className="text-3xl font-bold text-white">{userBounties.posted?.length || 0}</p>
            </div>
            <div className="p-3 bg-[#3b82f6] bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Claimed Bounties</h3>
              <p className="text-3xl font-bold text-white">{userBounties.claimed?.length || 0}</p>
            </div>
            <div className="p-3 bg-[#10b981] bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bounties Sections */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Bounties You Posted</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3b82f6]"></div>
            </div>
          ) : (
            <BountyList bounties={userBounties.posted} />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Bounties You Claimed</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3b82f6]"></div>
            </div>
          ) : (
            <BountyList bounties={userBounties.claimed} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
