import React, { useState, useEffect } from 'react';

const Login = () => {
  const handleLogin = () => {
    // Redirect to backend GitHub OAuth login
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/github`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
      {/* Logo and Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white mb-2">GitPaid</h1>
        <p className="text-[#94a3b8] text-xl">Get rewarded for your open source contributions</p>
      </div>
      
      {/* Card */}
      <div className="bg-[#1e293b] rounded-xl shadow-2xl p-8 w-full max-w-md border border-[#334155]">
        <div className="space-y-6">
          {/* Info Section */}
          <div className="bg-[#0f172a] rounded-lg p-4 border border-[#334155]">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-[#3b82f6] bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Secure Authentication</h3>
                <p className="text-[#94a3b8] text-sm mt-1">Login with your GitHub account to access GitPaid</p>
              </div>
            </div>
          </div>
          
          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all duration-300 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-[#94a3b8] text-sm">
          By continuing, you agree to our <a href="#" className="text-[#3b82f6] hover:text-[#60a5fa]">Terms</a> and <a href="#" className="text-[#3b82f6] hover:text-[#60a5fa]">Privacy Policy</a>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-10 text-[#94a3b8] text-sm">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> GitPaid. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
