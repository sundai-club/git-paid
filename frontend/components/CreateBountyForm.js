import React, { useState } from 'react';
import { createBounty } from '../api/bounty';
import { useRouter } from 'next/router';

const CreateBountyForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    repoOwner: '',
    repoName: '',
    issueNumber: '',
    amount: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await createBounty(form);
      // On success, go back to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create bounty');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create a Bounty</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium mb-1">Repo Owner (user or org)</label>
          <input 
            type="text" name="repoOwner" required 
            value={form.repoOwner} onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Repo Name</label>
          <input 
            type="text" name="repoName" required 
            value={form.repoName} onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Issue Number</label>
          <input 
            type="number" name="issueNumber" required 
            value={form.issueNumber} onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Bounty Amount (USD)</label>
          <input 
            type="number" name="amount" required 
            value={form.amount} onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Bounty
        </button>
      </form>
    </div>
  );
};

export default CreateBountyForm;
