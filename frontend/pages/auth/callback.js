import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      // Store the JWT in localStorage and extract username
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.username) {
          localStorage.setItem('username', payload.username);
        }
      } catch {
        // ignore decode errors
      }
      localStorage.setItem('token', token);
      router.replace('/dashboard');
    }
  }, [router]);

  return <p className="p-4">Logging in via GitHub...</p>;
};

export default AuthCallback;
