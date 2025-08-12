'use client';

import React, { useState, useEffect } from 'react';

interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  isClockedIn: boolean;
  lastClockIn?: Date;
  lastClockOut?: Date;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  type: 'CLOCK_IN' | 'CLOCK_OUT';
  timestamp: Date;
  latitude?: number;
  longitude?: number;
  notes?: string;
  employee?: {
    user: {
      name: string;
    };
  };
}

interface StaffDashboardProps {
  onRefresh?: () => void;
  refreshTrigger?: number;
}

export default function StaffDashboard({ onRefresh, refreshTrigger }: StaffDashboardProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch staff members
      const staffResponse = await fetch('/api/employees');
      const staffData = await staffResponse.json();
      
      // Fetch time entries for the last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const timeResponse = await fetch(`/api/time-entries?startDate=${oneWeekAgo.toISOString()}&endDate=${new Date().toISOString()}`);
      const timeData = await timeResponse.json();
      
      if (staffData.success) {
        console.log('📊 Staff data received:', staffData.employees);
        setStaffMembers(staffData.employees || []);
      }
      
      if (timeData.success) {
        console.log('⏰ Time entries received:', timeData.timeEntries);
        setTimeEntries(timeData.timeEntries || []);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchData();
    }
  }, [refreshTrigger]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate dashboard metrics
  const calculateMetrics = () => {
    console.log('🔍 calculateMetrics called with:', { staffMembers, timeEntries });
    
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Filter time entries for the last week
    const weekEntries = timeEntries.filter(entry => 
      new Date(entry.timestamp) >= oneWeekAgo
    );
    
    console.log('📅 Week entries:', weekEntries);

    // Group entries by date
    const entriesByDate = weekEntries.reduce((acc: any, entry) => {
      // Ensure entry has valid timestamp
      if (!entry || !entry.timestamp) {
        console.warn('Invalid entry:', entry);
        return acc;
      }
      
      try {
        const date = new Date(entry.timestamp).toDateString();
        if (!acc[date]) {
          acc[date] = { clockIns: 0, clockOuts: 0, totalHours: 0 };
        }
        
        if (entry.type === 'CLOCK_IN') {
          acc[date].clockIns++;
        } else if (entry.type === 'CLOCK_OUT') {
          acc[date].clockOuts++;
        }
      } catch (error) {
        console.error('Error processing entry:', entry, error);
      }
      
      return acc;
    }, {});

    // Calculate average hours per day
    const totalHours = Object.values(entriesByDate).reduce((sum: number, day: any) => sum + (day.totalHours as number), 0);
    const totalDays = Object.keys(entriesByDate).length;
    const avgHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;

    // Calculate total clock-ins today
    const today = new Date().toDateString();
    const todayClockIns = entriesByDate[today]?.clockIns || 0;

    // Calculate total hours per staff member
    console.log('👥 Processing staff members:', staffMembers);
    
    const staffHours = staffMembers.map(staff => {
      console.log('🔍 Processing staff:', JSON.stringify(staff, null, 2));
      
      // Ensure staff object has required properties
      if (!staff || !staff.id) {
        console.warn('Invalid staff object:', staff);
        return {
          id: 'unknown',
          employeeId: 'N/A',
          name: 'Unknown Staff',
          department: 'N/A',
          position: 'N/A',
          totalHours: 0,
          isClockedIn: false,
          lastClockIn: undefined,
          lastClockOut: undefined
        };
      }

      const staffEntries = weekEntries.filter(entry => 
        entry.employeeId === staff.id || entry.employee?.user?.name === staff.name
      );
      
      let totalHours = 0;
      let currentClockIn: Date | null = null;
      
      // Sort entries by timestamp to ensure proper order
      const sortedEntries = staffEntries.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      sortedEntries.forEach(entry => {
        if (entry.type === 'CLOCK_IN') {
          currentClockIn = new Date(entry.timestamp);
        } else if (entry.type === 'CLOCK_OUT' && currentClockIn) {
          const hours = (new Date(entry.timestamp).getTime() - currentClockIn.getTime()) / (1000 * 60 * 60);
          // Only add positive hours (prevent negative values)
          if (hours > 0) {
            totalHours += hours;
          }
          currentClockIn = null;
        }
      });
      
      // Ensure totalHours is never negative
      totalHours = Math.max(0, totalHours);
      
      return {
        ...staff,
        totalHours: Math.round(totalHours * 100) / 100
      };
    });

    return {
      avgHoursPerDay: Math.round(avgHoursPerDay * 100) / 100,
      todayClockIns,
      entriesByDate,
      staffHours
    };
  };

  const metrics = calculateMetrics();

  // Safety check for metrics
  if (!metrics || !metrics.staffHours || !metrics.entriesByDate) {
    console.warn('Invalid metrics object:', metrics);
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">Unable to load dashboard data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Staff Dashboard</h2>
            <p className="text-gray-600">Real-time staff status and time tracking overview</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              Auto-refresh every 30s
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Hours/Day</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics.avgHoursPerDay}h</p>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Staff</h3>
          <p className="text-3xl font-bold text-green-600">{staffMembers.length}</p>
          <p className="text-sm text-gray-600">All departments</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Currently Clocked In</h3>
          <p className="text-3xl font-bold text-orange-600">
            {staffMembers.filter(staff => staff.isClockedIn).length}
          </p>
          <p className="text-sm text-gray-600">Active now</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Clock-ins Today</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.todayClockIns}</p>
          <p className="text-sm text-gray-600">Total today</p>
        </div>
      </div>

      {/* Currently Clocked In Staff */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Currently Clocked In Staff</h3>
          <p className="text-sm text-gray-600">Staff members who are currently working</p>
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
                  Clocked In Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Today
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffMembers
                .filter(staff => staff.isClockedIn)
                .map((staff) => {
                  const clockInTime = staff.lastClockIn;
                  const hoursToday = clockInTime ? 
                    Math.round(((new Date().getTime() - new Date(clockInTime).getTime()) / (1000 * 60 * 60)) * 100) / 100 : 0;
                  
                  return (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-green-600">
                                {(staff.name && staff.name.charAt(0)) ? staff.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{staff.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{staff.employeeId || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {staff.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.position || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clockInTime ? new Date(clockInTime).toLocaleTimeString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium text-green-600">{hoursToday}h</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          
          {staffMembers.filter(staff => staff && staff.isClockedIn).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No staff members are currently clocked in</p>
            </div>
          )}
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Time Entries (Last 7 Days)</h3>
          <p className="text-sm text-gray-600">Clock in/out history with location details</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeEntries.slice(0, 20).map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(entry.employee?.user as any)?.name || (entry.employee as any)?.name || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.type === 'CLOCK_IN' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.type === 'CLOCK_IN' ? '🟢 Clock In' : '🔴 Clock Out'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.latitude && entry.longitude ? (
                      <span className="text-xs">
                        {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-gray-400">No location</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {timeEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No time entries found for the last 7 days</p>
            </div>
          )}
        </div>
      </div>

      {/* Staff Hours Summary */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Staff Hours Summary (Last 7 Days)</h3>
          <p className="text-sm text-gray-600">Total hours worked per staff member</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(metrics.staffHours || [])
                .filter(staff => staff && staff.id && staff.name) // Filter out invalid staff objects
                .sort((a, b) => (b.totalHours || 0) - (a.totalHours || 0))
                .map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{staff.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.employeeId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {staff.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium text-blue-600">{staff.totalHours || 0}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staff.isClockedIn 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staff.isClockedIn ? '🟢 Clocked In' : '⚪ Clocked Out'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Clock-in Breakdown */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Daily Clock-in Breakdown (Last 7 Days)</h3>
          <p className="text-sm text-gray-600">Number of people clocking in each day</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock-ins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock-outs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(metrics.entriesByDate || {})
                .filter(([date, data]) => date && data && typeof date === 'string')
                .sort(([dateA], [dateB]) => {
                  try {
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                  } catch (error) {
                    console.error('Error sorting dates:', error);
                    return 0;
                  }
                })
                .map(([date, data]: [string, any]) => {
                  if (!data || typeof data.clockIns !== 'number' || typeof data.clockOuts !== 'number') {
                    return null;
                  }
                  
                  const netChange = data.clockIns - data.clockOuts;
                  let isToday = false;
                  
                  try {
                    isToday = new Date(date).toDateString() === new Date().toDateString();
                  } catch (error) {
                    console.error('Error checking if date is today:', error);
                  }
                  
                  return (
                    <tr key={date} className={`hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        {isToday && (
                          <div className="text-xs text-blue-600 font-medium">Today</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium text-green-600">{data.clockIns}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="text-red-600">{data.clockOuts}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-medium ${netChange > 0 ? 'text-green-600' : netChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {netChange > 0 ? '+' : ''}{netChange}
                        </span>
                      </td>
                    </tr>
                  );
                })
                .filter(Boolean)}
            </tbody>
          </table>
          
          {(!metrics.entriesByDate || Object.keys(metrics.entriesByDate).length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No time entries found for the last 7 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
