'use client';

import React, { useState, useEffect } from 'react';

interface FacilityManagerProps {
  onSettingsChanged?: () => void;
}

interface FacilityLocation {
  latitude: number;
  longitude: number;
}

const DEFAULT_FACILITY_LOCATION: FacilityLocation = {
  latitude: 12.927538,
  longitude: 77.526807,
};

const DEFAULT_PERIMETER_RADIUS = 0.5; // 500 meters

export default function FacilityManager({ onSettingsChanged }: FacilityManagerProps) {
  const [location, setLocation] = useState<FacilityLocation>(DEFAULT_FACILITY_LOCATION);
  const [radius, setRadius] = useState(DEFAULT_PERIMETER_RADIUS);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load current settings from localStorage
    const savedLocation = localStorage.getItem('facilityLocation');
    const savedRadius = localStorage.getItem('facilityRadius');
    
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
    
    if (savedRadius) {
      try {
        setRadius(parseFloat(savedRadius));
      } catch (error) {
        console.error('Error parsing saved radius:', error);
      }
    }
  }, []);

  const saveToLocalStorage = (newLocation: FacilityLocation, newRadius: number) => {
    try {
      localStorage.setItem('facilityLocation', JSON.stringify(newLocation));
      localStorage.setItem('facilityRadius', newRadius.toString());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Validate inputs
      if (radius <= 0) {
        throw new Error('Perimeter radius must be greater than 0');
      }

      if (location.latitude < -90 || location.latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }

      if (location.longitude < -180 || location.longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }

      // Save to database via API
      const response = await fetch('/api/facility-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius * 1000, // Convert km to meters for database
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save to database');
      }

      // Also save to localStorage as backup
      saveToLocalStorage(location, radius);

      setMessage({ type: 'success', text: 'Facility settings updated successfully in database!' });
      setIsEditing(false);
      
      if (onSettingsChanged) {
        onSettingsChanged();
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save settings' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to current saved values
    const savedLocation = localStorage.getItem('facilityLocation');
    const savedRadius = localStorage.getItem('facilityRadius');
    
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (error) {
        setLocation(DEFAULT_FACILITY_LOCATION);
      }
    }
    
    if (savedRadius) {
      try {
        setRadius(parseFloat(savedRadius));
      } catch (error) {
        setRadius(DEFAULT_PERIMETER_RADIUS);
      }
    }
    
    setIsEditing(false);
    setMessage(null);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setMessage({ 
            type: 'error', 
            text: `Failed to get current location: ${error.message}` 
          });
        }
      );
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Geolocation is not supported by this browser' 
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Facility Settings</h3>
          <p className="text-sm text-gray-600">Configure facility location and perimeter for clock-in validation</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Settings
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Facility Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facility Location
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={location.latitude}
                onChange={(e) => setLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                placeholder="e.g., 40.7128"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={location.longitude}
                onChange={(e) => setLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>
          {isEditing && (
            <button
              onClick={handleUseCurrentLocation}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Use Current Location
            </button>
          )}
        </div>

        {/* Perimeter Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Perimeter Radius
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
            />
            <span className="text-gray-600">kilometers</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Employees must be within this radius to clock in/out
          </p>
        </div>

        {/* Current Settings Display */}
        {!isEditing && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Settings</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📍 Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
              <p>📏 Perimeter: {radius} km radius</p>
              <p>🌍 Coverage: ~{Math.PI * radius * radius} km² area</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
