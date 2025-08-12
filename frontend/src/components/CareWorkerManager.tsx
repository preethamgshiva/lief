'use client';

import React, { useState, useEffect } from 'react';
import StaffList from './StaffList';

interface StaffManagerProps {
  onWorkerAdded: () => void;
  onWorkerRemoved: () => void;
}

interface NewWorkerData {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  hireDate: string;
  password: string;
  role: 'EMPLOYEE' | 'MANAGER';
  facility?: string;
}

export default function StaffManager({ onWorkerAdded, onWorkerRemoved }: StaffManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<NewWorkerData>({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    position: '',
    hireDate: '',
    password: '',
    role: 'EMPLOYEE',
    facility: ''
  });

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/employees');
      const data = await response.json();
      
      if (data.success) {
        setStaffMembers(data.employees);
      } else {
        console.error('Failed to fetch staff members:', data.error);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add staff member');
      }

      if (data.success) {
        const roleText = formData.role === 'MANAGER' ? 'manager' : 'care worker';
        const portalText = formData.role === 'MANAGER' ? 'manager portal' : 'care worker portal';
        const message = data.message || `${data.user.name} added successfully as a ${roleText}! They can now log in to the ${portalText}.`;
        setSuccess(message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          employeeId: '',
          department: '',
          position: '',
          hireDate: '',
          password: '',
          role: 'EMPLOYEE',
          facility: ''
        });

        // Refresh staff list
        fetchStaffMembers();
        onWorkerAdded();

        // Close modal after a short delay
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to add staff member');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveWorker = async (employeeId: string, workerName: string) => {
    if (!confirm(`Are you sure you want to remove ${workerName}? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove staff member');
      }

      if (data.success) {
        setSuccess(`Staff member ${workerName} removed successfully!`);
        
        // Refresh staff list
        fetchStaffMembers();
        onWorkerRemoved();
        
        // Clear success message after a short delay
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to remove staff member');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button and Refresh Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStaffMembers}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm border border-gray-300"
            title="Refresh staff list"
          >
            <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Staff Member
          </button>
        </div>
      </div>

      {/* Staff List */}
      <StaffList 
        staffMembers={staffMembers}
        onRemoveWorker={handleRemoveWorker}
        isLoading={isLoading}
      />

      {/* Add Care Worker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Staff Member</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  <p className="font-medium mb-2">{success}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                    <p className="font-medium text-blue-800 mb-2">Login Credentials:</p>
                    <p className="text-blue-700"><strong>Employee ID:</strong> {formData.employeeId}</p>
                    <p className="text-blue-700"><strong>Password:</strong> {formData.password}</p>
                    <p className="text-xs text-blue-600 mt-2">Share these credentials with the care worker so they can access the portal.</p>
                  </div>
                </div>
              )}

              {/* Login Credentials Info */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="text-blue-800 font-medium mb-1">ℹ️ Login Information</p>
                <p className="text-blue-700 text-xs">Set a password for the staff member. They will use their Employee ID and this password to log in to the appropriate portal.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                </div>

                {formData.role === 'MANAGER' && (
                  <div>
                    <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-1">
                      Facility *
                    </label>
                    <input
                      type="text"
                      id="facility"
                      name="facility"
                      value={formData.facility}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter facility name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter employee ID"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select department</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Care">Care</option>
                    <option value="Support">Support</option>
                    <option value="Administration">Administration</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter position title"
                  />
                </div>

                <div>
                  <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter password for the staff member"
                  />
                  <p className="text-xs text-gray-500 mt-1">This password will be used by the staff member to log in to the portal.</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : `Add ${formData.role === 'MANAGER' ? 'Manager' : 'Care Worker'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
