# Prisma + Vercel Deployment Guide

This guide will help you deploy your Next.js + Prisma application to Vercel without the 401 authentication errors.

## 🚀 Quick Setup

### 1. Database Setup Options

You have several options for your database when deploying to Vercel:

#### Option A: Vercel Postgres (Recommended)
- **Pros**: Native Vercel integration, automatic connection pooling, optimized for serverless
- **Cons**: Slightly more expensive than alternatives

#### Option B: Supabase (Free tier available)
- **Pros**: Free tier, PostgreSQL, good performance
- **Cons**: Need to manage connection strings

#### Option C: PlanetScale (Free tier available)
- **Pros**: Free tier, MySQL, good performance
- **Cons**: Need to manage connection strings

#### Option D: Railway (Free tier available)
- **Pros**: Free tier, PostgreSQL, easy setup
- **Cons**: Need to manage connection strings

### 2. Environment Variables Setup

#### For Local Development:
Create a `.env.local` file in your `frontend` directory:

```bash
# Database
DATABASE_URL="your-database-connection-string"

# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id-here'
AUTH0_CLIENT_SECRET='your-client-secret-here'
```

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `DATABASE_URL` = `your-database-connection-string`

### 3. Database Connection String Examples

#### Vercel Postgres:
```
postgresql://username:password@host:port/database?sslmode=require
```

#### Supabase:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

#### PlanetScale:
```
mysql://username:password@host:port/database?sslaccept=strict
```

#### Railway:
```
postgresql://username:password@host:port/database
```

### 4. Fix Prisma for Serverless Deployment

The main issue with Prisma in Vercel is connection management. Here's how to fix it:

#### Update your Prisma schema:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql" // or "mysql" for PlanetScale
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Add this for connection pooling
}
```

#### Add connection pooling environment variable:
```bash
# Add this to your .env.local and Vercel
DIRECT_URL="your-direct-database-connection-string"
```

### 5. Database Setup

#### Option A: Use the existing setup script
```bash
cd frontend
npm run setup-db
```

#### Option B: Manual setup
1. Run Prisma migrations:
```bash
npx prisma migrate deploy
```

2. Seed the database:
```bash
npx prisma db seed
```

### 6. Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "Fix Prisma deployment for Vercel"
git push

# Vercel will automatically deploy
```

## 🔧 Common Issues & Solutions

### Issue 1: "Connection timeout" or "Connection refused"
**Solution**: 
- Ensure your database allows connections from Vercel's IP ranges
- Use connection pooling (add `directUrl` to Prisma schema)
- Check if your database is in the same region as Vercel

### Issue 2: "Too many connections"
**Solution**:
- Use connection pooling
- Add `connection_limit` to your database URL
- Consider using Vercel Postgres for automatic connection management

### Issue 3: "SSL required"
**Solution**:
- Add `?sslmode=require` to your PostgreSQL connection string
- For MySQL, add `?sslaccept=strict`

### Issue 4: "Prisma client not generated"
**Solution**:
- Ensure `prisma generate` runs during build
- Check that `@prisma/client` is in your dependencies
- Verify the build script includes `prisma generate`

## 🗄️ Database Provider Recommendations

### For Production (Vercel Postgres):
- **Best for**: Production applications
- **Setup**: Automatic in Vercel dashboard
- **Cost**: Starts at $20/month
- **Features**: Automatic backups, connection pooling, monitoring

### For Development/Testing (Supabase):
- **Best for**: Development and small applications
- **Setup**: Manual setup at supabase.com
- **Cost**: Free tier available
- **Features**: PostgreSQL, real-time subscriptions, auth

### For Development/Testing (PlanetScale):
- **Best for**: Development and small applications
- **Setup**: Manual setup at planetscale.com
- **Cost**: Free tier available
- **Features**: MySQL, branching, schema management

## 🔍 Testing Your Deployment

### 1. Test Database Connection
```bash
# Test locally
npm run test-db

# Test in Vercel (check function logs)
```

### 2. Test Authentication
- Try logging in with demo credentials
- Check browser console for errors
- Check Vercel function logs

### 3. Check Environment Variables
- Verify all variables are set in Vercel
- Check that `DATABASE_URL` is correct
- Ensure no typos in connection strings

## 🚨 Emergency Fixes

### If authentication still fails:

1. **Check Vercel Function Logs**:
   - Go to your Vercel dashboard
   - Check the function logs for errors
   - Look for database connection issues

2. **Verify Database Status**:
   - Check if your database is running
   - Verify connection string is correct
   - Test connection from your local machine

3. **Rollback if needed**:
   - Revert to previous deployment
   - Fix issues locally first
   - Test thoroughly before redeploying

## 📱 Demo Credentials

After successful deployment, test with:
- **Manager**: `EMP001` / `manager123`
- **Care Worker**: `EMP002` / `careworker123`
- **Manager 2**: `EMP003` / `manager123`

## 🎯 Next Steps

1. **Choose your database provider**
2. **Set up environment variables**
3. **Test locally with the new database**
4. **Deploy to Vercel**
5. **Test authentication**
6. **Monitor performance and logs**

## 🔒 Security Notes

- Never commit `.env` files to git
- Use strong database passwords
- Enable SSL for database connections
- Consider using connection pooling for production
- Monitor database access logs

---

**Remember**: The key to fixing Prisma deployment issues in Vercel is proper connection management and environment variable configuration. Most 401 errors are caused by database connection failures, not authentication logic issues.
