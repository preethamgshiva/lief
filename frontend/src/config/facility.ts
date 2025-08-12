export interface Location {
  latitude: number;
  longitude: number;
}

// Default facility configuration
export const DEFAULT_FACILITY_LOCATION: Location = {
  latitude: 12.927538, // Example: Global Academy of Technology (My college)
  longitude: 77.526807
};

export const DEFAULT_PERIMETER_RADIUS = 2; // 2 km radius

// Storage keys
const FACILITY_LOCATION_KEY = 'lief_facility_location';
const PERIMETER_RADIUS_KEY = 'lief_perimeter_radius';

// Get facility location from localStorage or use default
export const getFacilityLocation = (): Location => {
  if (typeof window === 'undefined') return DEFAULT_FACILITY_LOCATION;

  const stored = localStorage.getItem(FACILITY_LOCATION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored facility location:', error);
    }
  }
  return DEFAULT_FACILITY_LOCATION;
};

// Save facility location to localStorage
export const saveFacilityLocation = (location: Location): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FACILITY_LOCATION_KEY, JSON.stringify(location));
};

// Get perimeter radius from localStorage or use default
export const getPerimeterRadius = (): number => {
  if (typeof window === 'undefined') return DEFAULT_PERIMETER_RADIUS;

  const stored = localStorage.getItem(PERIMETER_RADIUS_KEY);
  if (stored) {
    const radius = parseFloat(stored);
    if (!isNaN(radius) && radius > 0) {
      return radius;
    }
  }
  return DEFAULT_PERIMETER_RADIUS;
};

// Save perimeter radius to localStorage
export const savePerimeterRadius = (radius: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERIMETER_RADIUS_KEY, radius.toString());
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if location is within perimeter
export const isWithinPerimeter = (location: Location, facilityLocation: Location, radius: number): boolean => {
  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    facilityLocation.latitude,
    facilityLocation.longitude
  );
  return distance <= radius;
};
