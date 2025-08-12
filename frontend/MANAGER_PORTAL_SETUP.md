# Manager Portal Authentication Setup

This document explains how to set up and use the new manager portal authentication system that restricts access to users with the "administration" position.

## Overview

The manager portal (`/manager`) now requires authentication and only allows users with the "administration" position in the database to access it. This provides an additional layer of security beyond just having a manager role.

## Setup Instructions

### 1. Database Setup

First, run the updated database setup script to create the required users:

```bash
node setup-db.js
```

This will create:
- An admin user with position "administration" (Employee ID: EMP001)
- Regular manager users with other positions
- Care worker users

### 2. Verify Setup

Run the test script to verify everything is working:

```bash
node test-manager-auth.js
```

You should see output confirming that the admin user exists with the "administration" position.

## How It Works

### Authentication Flow

1. **User visits `/manager`** → Redirected to login form
2. **User enters credentials** → System authenticates via `/api/employee-auth/login`
3. **Position check** → System verifies user has "administration" position via `/api/auth/check-position`
4. **Access granted** → User sees manager dashboard
5. **Access denied** → User sees error message

### Required Components

- **ManagerLoginForm**: Custom login form for the manager portal
- **Position Check API**: `/api/auth/check-position` endpoint
- **Updated Manager Page**: Now includes authentication logic
- **Middleware**: Protects the manager route

## Access Requirements

To access the manager portal, a user must have:

1. ✅ Valid employee account in the database
2. ✅ Correct employee ID and password
3. ✅ Active account status
4. ✅ Position field set to exactly "administration"

## Demo Credentials

For testing purposes, use these credentials:

- **Employee ID**: EMP001
- **Password**: manager123
- **Position**: administration
- **Department**: Administration

## Security Features

- **Position-based access control**: Only "administration" position users can access
- **Session management**: Uses secure HTTP-only cookies
- **Authentication validation**: Verifies both credentials and position
- **Automatic logout**: Session expires after 24 hours

## Troubleshooting

### Common Issues

1. **"Access denied" error**
   - Check if user's position is exactly "administration" (case-sensitive)
   - Verify the user exists in the database

2. **"No session found" error**
   - User needs to log in first
   - Check if cookies are enabled

3. **"User not found" error**
   - Run `setup-db.js` to create required users
   - Check database connection

### Debug Steps

1. Run `test-manager-auth.js` to verify database setup
2. Check browser console for authentication errors
3. Verify the position field in the database matches exactly
4. Ensure the user account is active (`isActive: true`)

## API Endpoints

### `/api/auth/check-position`
- **Method**: GET
- **Purpose**: Verify user has "administration" position
- **Returns**: User data if access granted, error if denied

### `/api/employee-auth/login`
- **Method**: POST
- **Purpose**: Authenticate user credentials
- **Body**: `{ employeeId, password }`

## Database Schema

The system relies on these key fields:

```sql
-- Users table
users: id, email, name, role, isActive

-- Staff members table  
staff_members: userId, employeeId, department, position, password
```

**Critical**: The `position` field must be exactly "administration" for manager portal access.

## Future Enhancements

- Add role-based permissions within the manager portal
- Implement audit logging for access attempts
- Add multi-factor authentication
- Create admin panel for managing user positions

