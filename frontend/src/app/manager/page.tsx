'use client';

import React, { useState, useEffect } from 'react';
import StaffDashboard from '../../components/StaffDashboard';
import StaffManager from '../../components/CareWorkerManager';
import FacilityManager from '../../components/FacilityManager';
import SignupRequestManager from '../../components/SignupRequestManager';

// Simple user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
  position?: string;
  department?: string;
}

// Simple login form component
function LoginForm({ onLogin }: { onLogin: (user: User) => void }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== 'MANAGER' && data.user.role !== 'ADMIN') {
        throw new Error('Access denied. Manager or Admin role required.');
      }

      // Clear form
      setEmployeeId('');
      setPassword('');
      
      // Call login success
      onLogin(data.user);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setPassword(''); // Clear password on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manager Portal</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter your employee ID"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Return to Home Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Home
            </button>
          </div>

          {/* Test Manager Login Details */}
          <div className="mt-4 p-3 bg-orange-200 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">
              <strong>Test Manager Login:</strong>
            </p>
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p><strong>Employee ID:</strong> MGR001</p>
              <p><strong>Password:</strong> manager123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main dashboard component
function ManagerDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeView, setActiveView] = useState<'overview' | 'charts' | 'staff' | 'facility' | 'applications'>('overview');
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch staff members
      const staffResponse = await fetch('/api/employees');
      const staffData = await staffResponse.json();

      if (!staffResponse.ok) {
        throw new Error(staffData.error || 'Failed to fetch staff data');
      }

      setStaffMembers(staffData.employees || []);

      // Fetch time entries
      const timeResponse = await fetch('/api/time-entries');
      const timeData = await timeResponse.json();

      if (!timeResponse.ok) {
        throw new Error(timeData.error || 'Failed to fetch time entries');
      }

      setTimeEntries(timeData.timeEntries || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error loading dashboard</p>
            <p>{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name}! {activeView === 'overview' ? "Here's your team overview." : 
              activeView === 'charts' ? "View detailed analytics and charts." :
              activeView === 'staff' ? "Manage your staff and view time tracking." :
              activeView === 'facility' ? "Configure facility settings and parameters." :
              "Review and manage care worker applications."}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Position: {user.position || 'N/A'} • Department: {user.department || 'N/A'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* View Toggle Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveView('charts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'charts'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📈 Analytics & Charts
            </button>
            <button
              onClick={() => setActiveView('staff')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👥 Staff Management
            </button>
            <button
              onClick={() => setActiveView('facility')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'facility'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏢 Facility Settings
            </button>
            <button
              onClick={() => setActiveView('applications')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'applications'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📝 Applications
            </button>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'overview' && (
          <>
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Staff</h3>
                <p className="text-3xl font-bold text-blue-600">{staffMembers.length}</p>
                <p className="text-sm text-gray-600">All departments</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Today</h3>
                <p className="text-3xl font-bold text-green-600">
                  {timeEntries.filter((entry: any) => 
                    entry.type === 'CLOCK_IN' && 
                    new Date(entry.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
                <p className="text-sm text-gray-600">Clock-ins today</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h3>
                <p className="text-3xl font-bold text-orange-600">{timeEntries.length}</p>
                <p className="text-sm text-gray-600">Total entries</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {timeEntries.length > 0 ? (
                  timeEntries.slice(0, 10).map((entry: any) => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            entry.type === 'CLOCK_IN' ? 'bg-green-500' :
                            entry.type === 'CLOCK_OUT' ? 'bg-red-500' :
                            entry.type === 'BREAK_START' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="font-medium text-gray-800">{entry.employee?.user?.name || 'Unknown User'}</span>
                          <span className="text-gray-600">
                            {entry.type === 'CLOCK_IN' ? 'clocked in' :
                             entry.type === 'CLOCK_OUT' ? 'clocked out' :
                             entry.type === 'BREAK_START' ? 'started break' : 'ended break'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                          <br />
                          <span className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Employee Details */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {entry.employee?.employeeId || 'N/A'}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {entry.employee?.department || 'N/A'}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {entry.employee?.position || 'N/A'}
                        </span>
                      </div>
                      
                      {/* Notes/Description */}
                      {entry.notes && (
                        <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-500">
                          <span className="text-sm text-gray-700">
                            <strong>Notes:</strong> {entry.notes}
                          </span>
                        </div>
                      )}
                      
                      {/* Location Info */}
                      {entry.latitude && entry.longitude && (
                        <div className="mt-2 text-xs text-gray-500">
                          📍 Location: {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activity to display</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeView === 'charts' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics & Charts</h3>
            <p className="text-gray-600 mb-4">Comprehensive analytics and performance metrics</p>
            <StaffDashboard onRefresh={handleRefresh} refreshTrigger={0} />
          </div>
        )}

        {activeView === 'staff' && (
          <div className="mb-8">
            <StaffManager 
              onWorkerAdded={handleRefresh}
              onWorkerRemoved={handleRefresh}
            />
            <div className="mt-8">
              <StaffDashboard onRefresh={handleRefresh} refreshTrigger={0} />
            </div>
          </div>
        )}

        {activeView === 'facility' && (
          <div className="mb-8">
            <FacilityManager onSettingsChanged={handleRefresh} />
          </div>
        )}

        {activeView === 'applications' && (
          <div className="mb-8">
            <SignupRequestManager />
          </div>
        )}
      </div>
    </div>
  );
}

// Main component
export default function ManagerPage() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show login form if no user, otherwise show dashboard
  return user ? (
    <ManagerDashboard user={user} onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}
