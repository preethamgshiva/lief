# Care Facility Management System

A modern, full-stack application for managing care workers, time tracking, and facility operations.

## 🚀 Features

- **User Authentication**: Secure login system for managers and care workers
- **Employee Management**: Add, remove, and manage care workers
- **Time Tracking**: Clock in/out functionality with location validation
- **Analytics Dashboard**: Comprehensive reporting and statistics
- **Facility Settings**: Configure facility location and perimeter settings
- **Responsive Design**: Modern UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Custom session-based auth system
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/lief_care?retryWrites=true&w=majority"

# App
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Note**: Replace `username`, `password`, and `cluster.mongodb.net` with your MongoDB Atlas credentials.

### 3. Database Setup

#### Option A: Using Prisma (Recommended)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to MongoDB
npm run db:push

# Run database setup script
npm run setup-db
```

#### Option B: Manual Setup

```bash
# Generate Prisma client
npm run db:generate

# Open Prisma Studio to manage data
npm run db:studio
```

### 4. Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ **MongoDB Atlas Setup**

**Important**: Before running the application, you need to set up MongoDB Atlas:

1. **Follow the detailed setup guide**: [MONGODB_SETUP.md](./MONGODB_SETUP.md)
2. **Create your database cluster** and get the connection string
3. **Update your `.env.local`** with the MongoDB connection string
4. **Run the setup commands** below

## 🔐 Default Login Credentials

After running the setup script, you can use these credentials:

### Manager Account
- **Employee ID**: MGR001
- **Password**: manager123

### Care Worker Accounts
- **John Doe**: EMP001 / employee123
- **Jane Smith**: EMP002 / employee123  
- **Mike Johnson**: EMP003 / employee123

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── employees/     # Employee management
│   │   ├── time-entries/  # Time tracking
│   │   └── analytics/     # Reporting & analytics
│   ├── manager/           # Manager dashboard
│   ├── care-worker/       # Care worker portal
│   └── login/             # Login page
├── components/             # React components
├── lib/                    # Utility libraries
│   ├── auth-service.ts    # Authentication logic
│   ├── time-entry-service.ts # Time tracking logic
│   └── prisma.ts          # Database client
└── config/                 # Configuration files
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run setup-db` - Initialize database with sample data

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **Prisma Client Error**
   - Run `npm run db:generate` after schema changes
   - Restart your development server

3. **Authentication Issues**
   - Clear browser cookies/localStorage
   - Verify environment variables are set correctly

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check Prisma schema for syntax errors

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub.
