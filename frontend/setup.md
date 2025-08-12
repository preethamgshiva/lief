# Setup Guide

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/care_facility_db"

# App Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Example DATABASE_URL formats:

### Local PostgreSQL
```
postgresql://username:password@localhost:5432/database_name
```

### Supabase
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Railway
```
postgresql://postgres:[YOUR-PASSWORD]@containers-us-west-[XX].railway.app:[PORT]/railway
```

### Vercel Postgres
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require
```

## Quick Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Setup database with sample data
npm run setup-db

# 5. Start development server
npm run dev
```

## Database Setup Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database: `createdb care_facility_db`
3. Update DATABASE_URL in `.env.local`
4. Run setup commands

### Option 2: Cloud Database (Recommended for deployment)
1. Create a PostgreSQL database in your preferred cloud provider
2. Copy the connection string to your `.env.local`
3. Run setup commands

## Verification

After setup, test your database connection:

```bash
npm run test-db
```

This should show:
- ✅ Database connection successful!
- 📋 Available tables
- 👥 Total users in database
- 👤 Sample users (if any exist)
