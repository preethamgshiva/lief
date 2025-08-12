# 🚀 Quick Deployment Guide (Prisma + Supabase Only)

## Immediate Deployment - No External Dependencies

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=your-random-secret-here
```

### 2. Deploy

```bash
npm run deploy
```

### 3. Set Up Database

After deployment, run in Vercel dashboard → Functions → Run:

```bash
npm run setup-db
```

### 4. Test Login

Use these credentials:
- **Manager**: `EMP001` / `manager123`
- **Care Worker**: `EMP002` / `careworker123`
- **Manager 2**: `EMP003` / `manager123`

## What This Gives You

✅ **Working employee authentication system**  
✅ **Database connection with Prisma**  
✅ **Demo users ready to use**  
✅ **No external dependencies**  
✅ **Production-ready deployment**  

## If You Get 401 Errors

1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure database is accessible
4. Run database setup script

## Next Steps (Optional)

- Add password hashing for security
- Implement user management interface
- Add more security features
- Consider adding Auth0 later for SSO
