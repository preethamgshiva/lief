# 🚀 Deployment Guide

This guide will help you deploy your Lief Care Management System to various free platforms.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Database**: You'll need a PostgreSQL database (we'll use free options)
3. **Environment Variables**: Set up your production environment variables

## 🆓 Free Deployment Options

### 1. **Vercel** (Recommended for Next.js)
- **Free Tier**: Unlimited deployments, 100GB bandwidth/month
- **Best For**: Frontend applications, Next.js apps
- **Limitations**: Serverless functions timeout at 10s (Hobby), 60s (Pro)

#### Setup Steps:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

#### Environment Variables in Vercel:
- Go to your project dashboard
- Navigate to Settings → Environment Variables
- Add all variables from your `.env` file

### 2. **Railway**
- **Free Tier**: $5 credit/month, 500 hours
- **Best For**: Full-stack applications, databases
- **Limitations**: Sleeps after inactivity

#### Setup Steps:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Database Setup:
- Create new PostgreSQL database in Railway
- Use the connection string as your `DATABASE_URL`

### 3. **Render**
- **Free Tier**: 750 hours/month, sleeps after 15 minutes
- **Best For**: Web services, static sites
- **Limitations**: Cold starts, limited bandwidth

#### Setup Steps:
1. Connect your GitHub repository
2. Choose "Web Service"
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

### 4. **Netlify**
- **Free Tier**: 100GB bandwidth/month, 300 build minutes
- **Best For**: Static sites, JAMstack
- **Limitations**: Not ideal for full-stack apps with APIs

## 🗄️ Database Options

### 1. **Supabase** (Recommended)
- **Free Tier**: 500MB database, 2GB bandwidth
- **Setup**: 
  - Create account at supabase.com
  - Create new project
  - Use connection string from Settings → Database

### 2. **Neon**
- **Free Tier**: 3GB storage, unlimited connections
- **Setup**: 
  - Create account at neon.tech
  - Create new project
  - Copy connection string

### 3. **Railway PostgreSQL**
- **Free Tier**: Included with Railway deployment
- **Setup**: Create database in same Railway project

## 🔧 Environment Variables

Set these in your deployment platform:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Auth0 (if using)
AUTH0_SECRET="your-secret"
AUTH0_BASE_URL="https://your-domain.vercel.app"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"

# Next.js
NODE_ENV="production"
```

## 🚀 Quick Deploy Commands

### Vercel:
```bash
cd frontend
npm run build
vercel --prod
```

### Railway:
```bash
cd frontend
railway up
```

### Render:
```bash
# Deploy via GitHub integration
# No CLI commands needed
```

## 📊 Post-Deployment Checklist

- [ ] Database connection working
- [ ] Environment variables set correctly
- [ ] API endpoints responding
- [ ] Authentication working (if applicable)
- [ ] Charts displaying data
- [ ] Mobile responsiveness
- [ ] Performance optimization

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version (use 18+)
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

2. **Database Connection**:
   - Verify DATABASE_URL format
   - Check database accessibility
   - Run migrations if needed

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart deployment after adding variables

## 📞 Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/support](https://railway.app/support)
- **Render**: [render.com/docs](https://render.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

**Happy Deploying! 🎉**
