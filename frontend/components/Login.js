import React from 'react';

const Login = () => {
  const handleLogin = () => {
    // Redirect to backend GitHub OAuth login
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/github`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button 
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
      >
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;
