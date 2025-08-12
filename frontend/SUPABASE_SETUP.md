# Supabase Database Setup Guide

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new project

## Step 2: Get Database Credentials
1. In your Supabase dashboard, go to Settings > Database
2. Copy the following information:
   - Host: `db.[YOUR-PROJECT-REF].supabase.co`
   - Database name: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: (the one you set during project creation)

## Step 3: Update Environment Variables
Update your `.env.local` file with:
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Step 4: Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations if you have them
npx prisma migrate deploy
```

## Step 5: Verify Connection
```bash
npm run test-db
```

## Step 6: Deploy to Vercel
1. Set environment variables in Vercel dashboard
2. Deploy using: `vercel --prod`

## Troubleshooting
- If you get connection errors, check your IP allowlist in Supabase
- Make sure your database password is correct
- Verify the project reference in your connection string
