import React from 'react';

const BountyList = ({ bounties, actionName, onAction, actionLoading }) => {
  if (!bounties || bounties.length === 0) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 text-center">
        <p className="text-gray-400">No bounties to display.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#334155] shadow-lg">
      <table className="min-w-full text-sm divide-y divide-[#334155]">
        <thead className="bg-[#1e293b]">
          <tr>
            <th className="px-6 py-4 text-left font-medium text-gray-300 uppercase tracking-wider">Repository</th>
            <th className="px-6 py-4 text-left font-medium text-gray-300 uppercase tracking-wider">Issue #</th>
            <th className="px-6 py-4 text-left font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-left font-medium text-gray-300 uppercase tracking-wider">Status</th>
            {actionName && <th className="px-6 py-4 text-right"></th>}
          </tr>
        </thead>
        <tbody className="bg-[#0f172a] divide-y divide-[#334155]">
          {bounties.map(bounty => (
            <tr key={bounty.id} className="hover:bg-[#1e293b] transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="font-medium">{bounty.repoOwner}/{bounty.repoName}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#3b82f6] bg-opacity-20 text-[#3b82f6]">
                  #{bounty.issueNumber}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-[#10b981] font-medium flex items-center">
                  <span className="text-gray-400 mr-1">Ξ</span>
                  {bounty.amount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  bounty.status === 'OPEN' 
                    ? 'bg-[#3b82f6] bg-opacity-20 text-[#60a5fa]' 
                    : bounty.status === 'CLAIMED' 
                      ? 'bg-[#eab308] bg-opacity-20 text-[#facc15]' 
                      : 'bg-[#10b981] bg-opacity-20 text-[#34d399]'
                }`}>
                  {bounty.status}
                </span>
                {bounty.status === 'CLAIMED' && bounty.claimer?.githubUsername && (
                  <span className="ml-2 text-gray-400 text-xs">
                    by {bounty.claimer.githubUsername}
                  </span>
                )}
              </td>
              {actionName && (
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onAction(bounty.id)}
                    disabled={actionLoading === bounty.id}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      actionLoading === bounty.id
                        ? 'bg-opacity-70 cursor-not-allowed '
                        : ''
                    }${
                      actionName === 'Claim' 
                        ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white shadow-md' 
                        : 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-md'
                    }`}
                  >
                    {actionLoading === bounty.id ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {actionName === 'Claim' ? 'Claiming...' : 'Processing...'}
                      </div>
                    ) : actionName}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BountyList;
