# Lief Care Management System

A comprehensive care management system built with Next.js, TypeScript, and Tailwind CSS. This system provides role-based access for managers and care workers with geolocation-based clock-in/out functionality.

## 🚀 Features

### Manager Dashboard
- **Facility Perimeter Management**: Set and configure facility location and perimeter radius
- **Staff Monitoring**: Real-time view of currently clocked-in staff
- **Time Tracking**: Complete history of all staff time entries
- **Analytics Dashboard**: Average hours per day, daily clock-ins, and weekly hours per staff
- **Settings Sync**: Automatic synchronization of facility settings to care worker devices

### Care Worker Dashboard
- **Geolocation Clock-in/out**: GPS-based time tracking with perimeter validation
- **Optional Notes**: Add notes when clocking in or out
- **Real-time Status**: Current clock-in status and location information
- **Time History**: View today's time entries with timestamps and notes
- **Settings Updates**: Automatic notification when facility settings are updated

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Geolocation**: Browser Geolocation API
- **Storage**: localStorage for facility settings
- **Build Tool**: Vite (via Next.js)

## 📁 Project Structure

```
lief/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Home page with role selection
│   │   │   ├── manager/     # Manager dashboard
│   │   │   └── care-worker/ # Care worker dashboard
│   │   └── config/          # Shared configuration
│   │       └── facility.ts  # Facility settings and utilities
│   ├── public/              # Static assets
│   └── package.json         # Dependencies and scripts
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lief
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### For Managers
1. Click "Login as Manager" on the home page
2. Set facility location and perimeter radius in the settings
3. Monitor staff clock-ins and time entries
4. View analytics and reports

### For Care Workers
1. Click "Login as Care Worker" on the home page
2. Allow location access when prompted
3. Clock in when within the facility perimeter
4. Add optional notes when clocking in/out
5. View your time entries and status

## 🔧 Configuration

### Facility Settings
- **Location**: Set facility coordinates (latitude/longitude)
- **Perimeter Radius**: Configure allowed clock-in radius (default: 2km)
- **Auto-sync**: Settings automatically sync to all care worker devices

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
# Add any environment variables here
```

## 📊 Features in Detail

### Geolocation System
- Uses Haversine formula for accurate distance calculation
- Real-time perimeter validation
- High-accuracy GPS with timeout and caching
- Configurable perimeter radius

### Data Persistence
- localStorage for facility settings
- Real-time synchronization between manager and care worker pages
- Persistent settings across browser sessions

### User Experience
- Modern, responsive design
- Real-time updates and notifications
- Intuitive navigation and status indicators
- Mobile-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
