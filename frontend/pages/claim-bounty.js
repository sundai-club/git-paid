import React, { useEffect } from 'react';
import ClaimBounty from '../components/ClaimBounty';
import { useRouter } from 'next/router';

export default function ClaimBountyPage() {
  const router = useRouter();
  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('token')) {
        router.push('/');
      }
    }
  }, [router]);

  return (
    <div className="p-4">
      <ClaimBounty />
    </div>
  );
}
