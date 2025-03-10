import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Layout = ({ children }) => {
  const router = useRouter();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
  const username = typeof window !== 'undefined' && localStorage.getItem('username');
  
  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };
  
  // Don't show navigation on login page
  const isLoginPage = router.pathname === '/';
  
  if (isLoginPage) {
    return <main>{children}</main>;
  }
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation Header */}
      <header className="bg-[#1e293b] border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/dashboard">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent cursor-pointer">
                  GitPaid
                </span>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/dashboard' 
                    ? 'bg-[#3b82f6] text-white' 
                    : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                } cursor-pointer transition-colors duration-200`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/create-bounty">
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/create-bounty' 
                    ? 'bg-[#3b82f6] text-white' 
                    : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                } cursor-pointer transition-colors duration-200`}>
                  Create Bounty
                </span>
              </Link>
              <Link href="/claim-bounty">
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/claim-bounty' 
                    ? 'bg-[#3b82f6] text-white' 
                    : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                } cursor-pointer transition-colors duration-200`}>
                  Browse Bounties
                </span>
              </Link>
              <Link href="/review">
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/review' 
                    ? 'bg-[#3b82f6] text-white' 
                    : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                } cursor-pointer transition-colors duration-200`}>
                  Review
                </span>
              </Link>
              
              {/* User Menu */}
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-300">{username}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#1e293b] border-t border-[#334155] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} GitPaid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
