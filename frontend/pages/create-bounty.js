import React, { useEffect, useState } from 'react';
import CreateBountyForm from '../components/CreateBountyForm';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CreateBountyPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Redirect to login if not authenticated
    // Client-side only code
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('token')) {
        router.push('/');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation */}
      <header className="bg-[#1e293b] border-b border-[#334155] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">GitPaid</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/dashboard" className="text-[#94a3b8] hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/create-bounty" className="text-white font-medium">
                  Create Bounty
                </Link>
              </li>
              <li>
                <Link href="/claim-bounty" className="text-[#94a3b8] hover:text-white transition-colors">
                  Claim Bounty
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Create a New Bounty</h1>
        {isClient && <CreateBountyForm />}
      </div>
    </div>
  );
}
