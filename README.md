# Lief Care Management System

## Project Overview

The Lief Care Management System is a comprehensive web-based application designed to streamline care facility operations through advanced time tracking, staff management, and real-time analytics. This system addresses the critical need for accurate attendance monitoring in healthcare environments where precision and reliability are paramount.

Built with modern web technologies, the system provides role-based access control, geolocation-based clock-in/out functionality, and comprehensive reporting capabilities. It serves as a complete solution for care facility administrators and staff members to manage daily operations efficiently.

## Core Functionality

### Manager Portal
The manager portal serves as the administrative hub for facility operations:

- **Facility Configuration**: Set and manage facility location coordinates and perimeter radius for geolocation validation
- **Staff Oversight**: Real-time monitoring of currently clocked-in staff members with live status updates
- **Time Entry Management**: Comprehensive tracking of all staff time entries with detailed timestamps and location data
- **Analytics Dashboard**: Advanced reporting including average hours per day, daily clock-in statistics, and weekly hours per staff member
- **Application Review**: Management of care worker applications with status tracking and review capabilities
- **Settings Synchronization**: Automatic distribution of facility settings to all care worker devices

### Care Worker Portal
The care worker portal provides essential tools for daily operations:

- **Geolocation Time Tracking**: GPS-based clock-in/out system with perimeter validation to ensure staff are physically present at the facility
- **Optional Notes**: Ability to add contextual notes when clocking in or out for better record keeping
- **Real-time Status**: Current clock-in status display with location information and facility proximity indicators
- **Time History**: Comprehensive view of daily time entries with detailed timestamps and notes
- **Automatic Updates**: Real-time synchronization of facility settings and perimeter changes

### Application Management
The system includes a complete application workflow:

- **Multi-platform Signup**: Support for both manual application submission and Google OAuth integration
- **Application Tracking**: Comprehensive status management from submission to final decision
- **Communication Tools**: Built-in messaging and review notes for application processing
- **Department Preferences**: Staff can specify preferred departments during the application process

## Technical Architecture

### Frontend Technology Stack
- **Framework**: Next.js 15.4.6 with App Router for modern React development
- **Language**: TypeScript 5 for type-safe development
- **Styling**: Tailwind CSS 3.3.0 for responsive and modern UI design
- **State Management**: React Hooks for component state management
- **Charts**: Recharts 3.1.2 for data visualization and analytics
- **Authentication**: Custom authentication system with role-based access control

### Backend Infrastructure
- **Database**: MongoDB with Prisma ORM for data persistence
- **API Routes**: Next.js API routes for backend functionality
- **Authentication**: Custom JWT-based authentication system
- **Geolocation**: Browser Geolocation API with Haversine formula for distance calculations
- **Real-time Updates**: Automatic data synchronization and live status updates

### Database Schema
The system utilizes a comprehensive database design:

- **User Management**: Centralized user accounts with role-based permissions
- **Employee Records**: Detailed staff information including departments, positions, and hire dates
- **Time Tracking**: Comprehensive time entry system with location data and notes
- **Facility Settings**: Configurable facility parameters and perimeter settings
- **Application Tracking**: Complete workflow management for care worker applications

## Installation and Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- MongoDB database instance
- Modern web browser with geolocation support

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd lief-main
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
   GOOGLE_CLIENT_ID="your_google_oauth_client_id"
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

### Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

## Usage Instructions

### For Facility Managers

1. **Initial Setup**
   - Access the manager portal using your credentials
   - Configure facility location coordinates and perimeter radius
   - Set up initial staff accounts and departments

2. **Daily Operations**
   - Monitor real-time staff clock-ins and clock-outs
   - Review time entry reports and analytics
   - Manage care worker applications
   - Update facility settings as needed

3. **Reporting and Analytics**
   - View comprehensive staff performance metrics
   - Analyze attendance patterns and trends
   - Generate reports for administrative purposes

### For Care Workers

1. **First-time Access**
   - Navigate to the care worker portal
   - Log in using your employee credentials
   - Allow location access when prompted

2. **Daily Time Tracking**
   - Ensure you are within the facility perimeter
   - Clock in when beginning your shift
   - Add optional notes for context
   - Clock out when completing your shift

3. **Status Monitoring**
   - Check your current clock-in status
   - View your time entry history
   - Monitor facility setting updates

### For Applicants

1. **Application Submission**
   - Access the care worker signup page
   - Choose between Google OAuth or manual form submission
   - Complete all required fields
   - Submit your application for review

2. **Application Tracking**
   - Applications are reviewed by management
   - Status updates are provided through the system
   - Communication channels are established for follow-up

## System Features

### Geolocation System
- **Perimeter Validation**: Uses the Haversine formula for accurate distance calculations
- **Real-time Monitoring**: Continuous validation of staff location during clock-in attempts
- **Configurable Radius**: Adjustable facility perimeter settings for different facility types
- **Location Caching**: Efficient location data management with timeout and caching mechanisms

### Data Management
- **Persistent Storage**: MongoDB-based data persistence with Prisma ORM
- **Real-time Synchronization**: Automatic updates across all connected devices
- **Data Integrity**: Comprehensive validation and error handling
- **Backup and Recovery**: Robust data management and recovery procedures

### Security Features
- **Role-based Access Control**: Different permission levels for managers and care workers
- **Secure Authentication**: Custom authentication system with password hashing
- **Data Privacy**: Secure handling of sensitive staff and facility information
- **Session Management**: Secure session handling and timeout mechanisms

## Configuration Options

### Facility Settings
- **Location Coordinates**: Latitude and longitude for facility positioning
- **Perimeter Radius**: Configurable distance for clock-in validation (default: 100 meters)
- **Auto-sync**: Automatic distribution of settings to all connected devices
- **Update Notifications**: Real-time alerts when facility parameters change

### User Management
- **Role Assignment**: Manager, Employee, and Admin role configurations
- **Department Structure**: Configurable department and position hierarchies
- **Access Control**: Granular permissions based on user roles
- **Account Management**: User creation, modification, and deactivation capabilities

## Troubleshooting

### Common Issues

1. **Geolocation Not Working**
   - Ensure browser location permissions are enabled
   - Check that the device has GPS capabilities
   - Verify internet connectivity for location services

2. **Database Connection Errors**
   - Verify MongoDB instance is running
   - Check database connection string in environment variables
   - Ensure proper network access to database server

3. **Authentication Problems**
   - Verify employee ID and password are correct
   - Check user account status in the system
   - Ensure proper role assignments

### Performance Optimization

1. **Database Indexing**
   - Ensure proper indexes on frequently queried fields
   - Monitor query performance and optimize as needed
   - Regular database maintenance and cleanup

2. **Caching Strategies**
   - Implement appropriate caching for frequently accessed data
   - Optimize API response times
   - Monitor system performance metrics

## Development Guidelines

### Code Structure
- **Component Organization**: Modular React components with clear separation of concerns
- **API Design**: RESTful API endpoints with consistent response formats
- **Error Handling**: Comprehensive error handling and user feedback
- **Testing**: Unit and integration testing for critical functionality

### Best Practices
- **Type Safety**: Full TypeScript implementation for development reliability
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliance and inclusive design principles
- **Performance**: Optimized rendering and efficient data management

## Support and Maintenance

### Technical Support
- **Documentation**: Comprehensive system documentation and user guides
- **Training Materials**: User training resources and best practice guides
- **Help Desk**: Technical support for system issues and questions
- **Updates**: Regular system updates and feature enhancements

### Maintenance Procedures
- **Regular Backups**: Automated database backup procedures
- **System Monitoring**: Continuous monitoring of system performance and health
- **Security Updates**: Regular security patches and vulnerability assessments
- **Performance Optimization**: Ongoing system optimization and improvement

## Future Enhancements

### Planned Features
- **Mobile Application**: Native mobile apps for iOS and Android
- **Advanced Analytics**: Machine learning-based insights and predictions
- **Integration Capabilities**: API integrations with third-party systems
- **Multi-facility Support**: Support for multiple facility locations

### Technology Roadmap
- **Real-time Communication**: Built-in messaging and notification systems
- **Advanced Reporting**: Custom report generation and export capabilities
- **Workflow Automation**: Automated approval processes and task management
- **Data Analytics**: Advanced business intelligence and reporting tools

## License and Legal

This project is proprietary software developed for care facility management. All rights are reserved by the development team. For licensing inquiries and commercial use, please contact the development team directly.

## Contact Information

For technical support, feature requests, or general inquiries:
- **Email**: support@liefcare.com
- **Phone**: +1 (555) 123-4567
- **Documentation**: Available through the system help section
- **Training**: Contact HR department for user training sessions

---

*This documentation is maintained by the Lief Care Management System development team. Last updated: December 2024*
