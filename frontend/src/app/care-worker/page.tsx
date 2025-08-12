'use client';

import React, { useState, useEffect } from 'react';

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

// Simple location interface
interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Time entry interface
interface TimeEntry {
  id: string;
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
  timestamp: Date;
  note?: string;
  location: Location;
}

// Default facility location
const DEFAULT_FACILITY_LOCATION: Location = {
  latitude: 40.7128,
  longitude: -74.0060,
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA'
};

const DEFAULT_PERIMETER_RADIUS = 100; // meters

// Utility functions for localStorage
const getFacilityLocation = (): Location => {
  if (typeof window === 'undefined') return DEFAULT_FACILITY_LOCATION;
  const saved = localStorage.getItem('lief_facility_location');
  return saved ? JSON.parse(saved) : DEFAULT_FACILITY_LOCATION;
};

const setFacilityLocation = (location: Location) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lief_facility_location', JSON.stringify(location));
};

const getPerimeterRadius = (): number => {
  if (typeof window === 'undefined') return DEFAULT_PERIMETER_RADIUS;
  const saved = localStorage.getItem('lief_perimeter_radius');
  return saved ? parseInt(saved) : DEFAULT_PERIMETER_RADIUS;
};

const setPerimeterRadius = (radius: number) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lief_perimeter_radius', radius.toString());
};

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

      if (data.user.role !== 'EMPLOYEE') {
        throw new Error('Access denied. Employee role required.');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Care Worker Portal</h1>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-green-600 hover:text-green-700 text-sm">
              ← Back to Home
            </a>
          </div>

          {/* Test Care Worker Login Details */}
          <div className="mt-4 p-3 bg-orange-200 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">
              <strong>Test Care Worker Login:</strong>
            </p>
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p><strong>Employee ID:</strong> EMP001</p>
              <p><strong>Password:</strong> employee123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main dashboard component
function CareWorkerDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [facilityLocation, setFacilityLocation] = useState<Location>(DEFAULT_FACILITY_LOCATION);
  const [perimeterRadius, setPerimeterRadius] = useState(DEFAULT_PERIMETER_RADIUS);

  // Load facility settings on component mount
  useEffect(() => {
    const loadFacilitySettings = async () => {
      try {
        console.log('🏢 Loading facility settings from database...');
        const response = await fetch('/api/facility-settings');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const realLocation: Location = {
              latitude: data.facility.latitude,
              longitude: data.facility.longitude,
            };
            console.log('✅ Loaded real facility location:', realLocation);
            console.log('📏 Facility radius:', data.facility.radius, 'meters');
            
            setFacilityLocation(realLocation);
            setPerimeterRadius(data.facility.radius);
            
            // Save to localStorage for future use
            setFacilityLocation(realLocation);
            setPerimeterRadius(data.facility.radius);
          }
        } else {
          console.log('⚠️ Using default facility location (could not fetch from database)');
          const savedLocation = getFacilityLocation();
          const savedRadius = getPerimeterRadius();
          setFacilityLocation(savedLocation);
          setPerimeterRadius(savedRadius);
        }
      } catch (error) {
        console.log('⚠️ Using default facility location (error fetching from database):', error);
        const savedLocation = getFacilityLocation();
        const savedRadius = getPerimeterRadius();
        setFacilityLocation(savedLocation);
        setPerimeterRadius(savedRadius);
      }
    };

    loadFacilitySettings();
    
    // Auto-refresh facility settings every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing facility settings...');
      loadFacilitySettings();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Get current location
  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Check if location is within facility perimeter
  const isWithinPerimeter = (location: Location): boolean => {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      facilityLocation.latitude,
      facilityLocation.longitude
    );
    return distance <= perimeterRadius;
  };

  // Handle clock in
  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const location = await getCurrentLocation();
      setCurrentLocation(location);

      if (!isWithinPerimeter(location)) {
        setError('You must be within the facility perimeter to clock in.');
        return;
      }

      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          type: 'CLOCK_IN',
          latitude: location.latitude,
          longitude: location.longitude,
          note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clock in');
      }

      setIsClockedIn(true);
      setSuccess('Successfully clocked in!');
      setNote('');
      
      // Refresh time entries
      fetchTimeEntries();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clock out
  const handleClockOut = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const location = await getCurrentLocation();
      setCurrentLocation(location);

      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          type: 'CLOCK_OUT',
          latitude: location.latitude,
          longitude: location.longitude,
          note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clock out');
      }

      setIsClockedIn(false);
      setSuccess('Successfully clocked out!');
      setNote('');
      
      // Refresh time entries
      fetchTimeEntries();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch time entries
  const fetchTimeEntries = async () => {
    try {
      const response = await fetch('/api/time-entries');
      if (!response.ok) throw new Error('Failed to fetch time entries');
      
      const data = await response.json();
      setTimeEntries(data.timeEntries || []);
    } catch (err) {
      console.error('Failed to fetch time entries:', err);
    }
  };

  // Load time entries on component mount
  useEffect(() => {
    fetchTimeEntries();
  }, []);

  // Format time for display
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString();
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Care Worker Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name}! Here's your work overview.
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

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Status</h3>
            <div className={`text-2xl font-bold ${isClockedIn ? 'text-green-600' : 'text-red-600'}`}>
              {isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isClockedIn ? 'You are currently working' : 'You are not currently working'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
            <div className="text-sm text-gray-600">
              {currentLocation ? (
                <div>
                  <div>Lat: {currentLocation.latitude.toFixed(4)}</div>
                  <div>Lon: {currentLocation.longitude.toFixed(4)}</div>
                  {currentLocation.address && <div>{currentLocation.address}</div>}
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div><strong>Distance to Facility:</strong> {calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      facilityLocation.latitude,
                      facilityLocation.longitude
                    ).toFixed(0)}m</div>
                    <div><strong>Within Perimeter:</strong> 
                      <span className={isWithinPerimeter(currentLocation) ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {isWithinPerimeter(currentLocation) ? ' YES' : ' NO'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                'Location not available'
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Facility</h3>
            <div className="text-sm text-gray-600">
              <div><strong>Coordinates:</strong> {facilityLocation.latitude.toFixed(6)}, {facilityLocation.longitude.toFixed(6)}</div>
              <div><strong>Address:</strong> {facilityLocation.address}</div>
              <div><strong>City:</strong> {facilityLocation.city}, {facilityLocation.state}</div>
              <div><strong>Perimeter:</strong> {perimeterRadius}m</div>
            </div>
          </div>
        </div>

        {/* Clock In/Out Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Time Tracking</h3>
            <button
              onClick={() => {
                const loadFacilitySettings = async () => {
                  try {
                    const response = await fetch('/api/facility-settings');
                    if (response.ok) {
                      const data = await response.json();
                      if (data.success) {
                        const realLocation = {
                          latitude: data.facility.latitude,
                          longitude: data.facility.longitude,
                        };
                        setFacilityLocation(realLocation);
                        setPerimeterRadius(data.facility.radius);
                        console.log('✅ Refreshed facility settings');
                        
                        // Show success message
                        setSuccess('Facility location refreshed from database!');
                        setTimeout(() => setSuccess(''), 3000);
                      }
                    }
                  } catch (error) {
                    console.error('❌ Error refreshing facility settings:', error);
                    setError('Failed to refresh facility location');
                    setTimeout(() => setError(''), 3000);
                  }
                };
                loadFacilitySettings();
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh Location
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Note (optional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                placeholder="Add a note about your work..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              {!isClockedIn ? (
                <button
                  onClick={handleClockIn}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Clock In'}
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Clock Out'}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>

        {/* Recent Time Entries */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Time Entries</h3>
          <div className="space-y-3">
            {timeEntries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    entry.type === 'CLOCK_IN' ? 'bg-green-500' :
                    entry.type === 'CLOCK_OUT' ? 'bg-red-500' :
                    entry.type === 'BREAK_START' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="font-medium text-gray-800">
                    {entry.type === 'CLOCK_IN' ? 'Clocked In' :
                     entry.type === 'CLOCK_OUT' ? 'Clocked Out' :
                     entry.type === 'BREAK_START' ? 'Break Started' : 'Break Ended'}
                  </span>
                  {entry.note && (
                    <span className="text-gray-600 text-sm">- {entry.note}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <div>{formatTime(entry.timestamp)}</div>
                  <div>{formatDate(entry.timestamp)}</div>
                </div>
              </div>
            ))}
            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No time entries found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function CareWorkerPage() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show login form if no user, otherwise show dashboard
  return user ? (
    <CareWorkerDashboard user={user} onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}
