'use client';

import React from 'react';

interface StaffListProps {
  staffMembers: any[];
  onRemoveWorker: (employeeId: string, workerName: string) => void;
  isLoading: boolean;
}

export default function StaffList({ staffMembers, onRemoveWorker, isLoading }: StaffListProps) {
  // Function to get plain text password from the originalPassword field
  const getPlainTextPassword = (member: any): string => {
    // Use the originalPassword field if available (from AuthService.getAllEmployees)
    if (member.originalPassword) {
      return member.originalPassword;
    }
    
    // Fallback to the old method for backward compatibility
    if (member.password) {
      // Common password mappings based on our sample data
      const passwordMap: { [key: string]: string } = {
        'bWFuYWdlcjEyM3NhbHQ=': 'manager123', // hashPassword('manager123')
        'ZW1wbG95ZWUxMjNzYWx0': 'employee123', // hashPassword('employee123')
      };
      
      // If we have a mapping, return the plain text password
      if (passwordMap[member.password]) {
        return passwordMap[member.password];
      }
      
      // If no mapping found, show a hint that it's hashed
      if (member.password.length > 20) {
        return '[Hashed Password]';
      }
    }
    
    return 'N/A';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading staff members...</span>
        </div>
      </div>
    );
  }

  if (staffMembers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first care worker.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Current Staff Members</h3>
            <p className="text-sm text-gray-600">Manage your care worker team</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm border border-gray-300"
            title="Refresh page"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {member.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.user.name}</div>
                      <div className="text-sm text-gray-500">{member.employeeId}</div>
                      <div className="text-sm text-gray-500">{member.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {member.department || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.position || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="relative group">
                      <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                        {getPlainTextPassword(member)}
                      </code>
                      {/* Show tooltip with hashed password for debugging */}
                      {member.password && member.password.length > 20 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Hashed: {member.password.substring(0, 20)}...
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(getPlainTextPassword(member) || '')}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Copy password"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.isClockedIn 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.isClockedIn ? 'Clocked In' : 'Clocked Out'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onRemoveWorker(member.employeeId, member.user.name)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Total Staff Members: <span className="font-medium">{staffMembers.length}</span>
        </div>
      </div>
    </div>
  );
}
