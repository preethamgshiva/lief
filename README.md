# Lief - WebDev Engineer Task Submission

## Project Overview

This is my submission for the Lief WebDev Engineer Task - a healthcare worker clock-in/out application built as a web application that can be used by healthcare organizations (such as hospitals) to have their care workers easily record and track when they come in for a shift and leave a shift. You can visit the site through https://lief-task.vercel.app .

## Tasks Implemented

### Manager Portal

#### 1. Location Perimeter Setting
- **Description**: Managers can set a location perimeter (e.g., within 2km of a location) where care workers can clock in
- **Implementation**: Facility settings page with latitude/longitude coordinates and configurable radius in meters
- **Location**: `frontend/src/components/FacilityManager.tsx`

#### 2. Staff Clock-in Status Table
- **Description**: See a table of all staff who are currently clocked in
- **Implementation**: Real-time dashboard showing currently active staff with their clock-in times
- **Location**: `frontend/src/components/StaffDashboard.tsx`

#### 3. Individual Staff Time Tracking
- **Description**: For each staff member, see when and where they clocked in and clocked out
- **Implementation**: Comprehensive time tracking table with GPS coordinates, timestamps, and location data
- **Location**: `frontend/src/app/manager/page.tsx` - Staff Time Tracking view

#### 4. Analytics Dashboard
- **Description**: Dashboard showing:
  - Average hours people are spending clocked in each day
  - Number of people clocking in each day
  - Total hours clocked in per staff over the last week
- **Implementation**: Charts and metrics using Recharts library
- **Location**: `frontend/src/components/StaffDashboard.tsx`

### Care Worker Portal

#### 1. Clock In Functionality
- **Description**: Care workers can clock in when they enter the perimeter
- **Implementation**: GPS-based perimeter validation using Haversine formula
- **Location**: `frontend/src/app/care-worker/page.tsx`

#### 2. Optional Notes on Clock In
- **Description**: When clocking in, care workers can provide an optional note
- **Implementation**: Text area for notes during clock-in process

#### 3. Perimeter Validation
- **Description**: App tells care workers they cannot clock in when outside the perimeter
- **Implementation**: Real-time location checking with error messages

#### 4. Clock Out Functionality
- **Description**: Care workers can clock out when they are already clocked in
- **Implementation**: Clock-out button with optional notes

#### 5. Optional Notes on Clock Out
- **Description**: When clocking out, care workers can provide an optional note
- **Implementation**: Text area for notes during clock-out process

### Partially Implemented Features

#### User Authentication
- **Status**: **PARTIALLY IMPLEMENTED**
- **Description**: Users should be able to register for account using username/password with Google login and email login using Auth0
- **Current Implementation**: Custom authentication system with username/password
- **Location**: `frontend/src/lib/auth-service.ts`

## Technical Implementation

### Frontend Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3.0 (Could not implement Ant Design or Grommet due to connection issues)
- **State Management**: React Hooks and Context (as required)
- **Charts**: Recharts 3.1.2 for analytics dashboard
- **Authentication**: Custom authentication system and Google oAuth (instead of Auth0 as specified)

### Backend Infrastructure
- **Database**: MongoDB with Prisma ORM (as recommended)
- **API Routes**: Next.js API routes (instead of GraphQL as specified)
- **Geolocation**: Browser Geolocation API with Haversine formula
- **Real-time Updates**: Automatic data synchronization

### Database Schema
The system uses a comprehensive database design with Prisma:
- **User Management**: Centralized user accounts with role-based permissions
- **Employee Records**: Staff information including departments, positions, and hire dates
- **Time Tracking**: Time entry system with location data and notes
- **Facility Settings**: Configurable facility parameters and perimeter settings

## Project Structure

```
lief-main/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Home page with role selection
│   │   │   ├── manager/     # Manager dashboard
│   │   │   └── care-worker/ # Care worker dashboard
│   │   ├── components/      # React components
│   │   │   ├── StaffDashboard.tsx      # Analytics dashboard
│   │   │   ├── FacilityManager.tsx     # Facility settings
│   │   │   └── CareWorkerSignup.tsx    # Application form
│   │   ├── lib/             # Utility libraries
│   │   │   ├── auth-service.ts         # Authentication logic
│   │   │   └── prisma.ts               # Database connection
│   │   └── prisma/          # Database schema
│   │       └── schema.prisma           # Prisma schema definition
│   ├── package.json         # Dependencies and scripts
│   └── README.md            # Project documentation
└── README.md                # This file
```

## Key Features Implemented

### 1. **Geolocation-Based Clock-in System**
- GPS perimeter validation using Haversine formula
- Configurable facility radius (default: 100 meters)
- Real-time location checking during clock-in attempts

### 2. **Comprehensive Manager Dashboard**
- Staff overview with real-time status
- Individual staff time tracking with detailed history
- Analytics dashboard with charts and metrics
- Facility settings management

### 3. **Care Worker Portal**
- Simple clock-in/out interface
- Location validation and error handling
- Optional notes for each time entry
- Time entry history and status display

### 4. **Real-time Data Management**
- Live updates of staff status
- Automatic data synchronization
- Comprehensive time entry tracking
- Location data storage and retrieval

## Setup and Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- MongoDB database instance
- Modern web browser with geolocation support

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/preethamgshiva/lief.git
   cd lief
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the frontend directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/lief_care_system"
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## Test Accounts

### Manager Access
- **Employee ID**: MGR001
- **Password**: manager123

### Care Worker Access
- **Employee ID**: EMP001
- **Password**: employee123

## What I Attempted vs. What Was Specified

### ✅ **Successfully Implemented (MVP)**
- Healthcare worker clock-in/out system
- Location perimeter validation
- Manager dashboard with staff monitoring
- Individual staff time tracking
- Analytics dashboard with required metrics
- GPS-based location tracking
- Optional notes for time entries
- Role-based access control

## Design Decisions & Trade-offs

### Why Tailwind CSS Instead of Grommet/Ant?
- **Connection Issues**: Had connectivity issues with AntD while deploying to Vercel
- **Rapid Development**: Faster to build responsive UI components
- **Modern Design**: Better visual appeal and modern aesthetics
- **Flexibility**: More control over styling and customization
- **Performance**: Smaller bundle size and better performance

### Why Custom Authentication Instead of Auth0?
-**Connectivity Issues**: Since i am using free tier of MongoDB, I was getting Connection Timed out Response with Auth0 implemented
- **Simplicity**: Faster to implement for MVP
- **Learning**: Better understanding of authentication flows
- **Customization**: More control over user roles and permissions

### Why REST API Instead of GraphQL?
-**Skill Fit**:  I have stronger expertise with REST, so I could build faster and more confidently
- **Simplicity**: Faster to implement for MVP
- **Familiarity**: More straightforward for this use case
- **Performance**: Adequate for the current feature set

## Future Improvements

If I were to continue developing this application, I would:

1. **Integrate Auth0** for proper authentication
2. **Migrate to GraphQL** for better data fetching
3. **Add real-time notifications** using WebSockets
4. **Implement offline functionality** for PWA
5. **Add push notifications** for location alerts

## Conclusion

This submission demonstrates a fully functional MVP of the healthcare worker clock-in/out system with all the core required features implemented. While I made some technical choices that differ from the recommended stack (Tailwind CSS instead of Grommet/Ant, custom auth instead of Auth0), the application successfully addresses all the primary requirements:

- ✅ Location perimeter setting and validation
- ✅ Staff clock-in status monitoring
- ✅ Individual time tracking with location data
- ✅ Comprehensive analytics dashboard
- ✅ Care worker clock-in/out functionality
- ✅ Optional notes system
- ✅ Responsive design for mobile and web

The application is production-ready for basic use cases and provides a solid foundation for future enhancements.

---

**Submission by**: Preetham G Shiva  
**Repository**: https://github.com/preethamgshiva/lief.git  
**Task**: Lief WebDev Engineer - Healthcare Worker Clock-in/out Application  
**Submission Date**: December 2024
