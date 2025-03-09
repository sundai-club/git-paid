import React, { useEffect } from 'react';
import CreateBountyForm from '../components/CreateBountyForm';
import { useRouter } from 'next/router';

export default function CreateBountyPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="p-4">
      <CreateBountyForm />
    </div>
  );
}
