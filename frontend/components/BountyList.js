import React from 'react';

const BountyList = ({ bounties, actionName, onAction }) => {
  if (!bounties || bounties.length === 0) {
    return <p className="text-gray-600">No bounties to display.</p>;
  }

  return (
    <table className="min-w-full text-sm text-left border">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2">Repository</th>
          <th className="px-4 py-2">Issue #</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Status</th>
          {actionName && <th className="px-4 py-2"></th>}
        </tr>
      </thead>
      <tbody className="bg-white">
        {bounties.map(bounty => (
          <tr key={bounty.id} className="border-b last:border-0">
            <td className="px-4 py-2">{bounty.repoOwner}/{bounty.repoName}</td>
            <td className="px-4 py-2">#{bounty.issueNumber}</td>
            <td className="px-4 py-2">${bounty.amount}</td>
            <td className="px-4 py-2">
              {bounty.status}
              {bounty.status === 'CLAIMED' && bounty.claimer?.githubUsername 
                ? ` by ${bounty.claimer.githubUsername}` 
                : ''}
            </td>
            {actionName && (
              <td className="px-4 py-2">
                <button 
                  onClick={() => onAction(bounty.id)}
                  className={`px-4 py-1 rounded ${
                    actionName === 'Claim' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {actionName}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BountyList;
