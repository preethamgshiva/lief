# 🚀 Deployment Checklist for LIEF Application (Prisma + Supabase Only)

## Pre-Deployment Setup

### 1. Database Configuration ✅
- [ ] Supabase project created and configured
- [ ] Database connection string obtained
- [ ] `DATABASE_URL` and `DIRECT_URL` set in environment
- [ ] Database migrations run: `npx prisma migrate deploy`

### 2. Environment Variables ✅
- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
- [ ] `DIRECT_URL` - Direct Supabase connection (same as DATABASE_URL)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `JWT_SECRET` - Random secret for employee authentication

## Deployment Steps

### 1. Local Testing ✅
- [ ] Run `npm run db:generate` to generate Prisma client
- [ ] Run `npm run setup-db` to create demo users
- [ ] Test employee login locally: `EMP001` / `manager123`
- [ ] Test care worker login locally: `EMP002` / `careworker123`

### 2. Vercel Deployment ✅
- [ ] Run `npm run deploy` or use Vercel dashboard
- [ ] Ensure build succeeds without errors
- [ ] Verify Prisma client is generated during build

### 3. Post-Deployment Configuration ✅
- [ ] Set environment variables in Vercel dashboard
- [ ] Run database setup: `npm run setup-db` (if needed)
- [ ] Test production deployment

## Testing Checklist

### 1. Employee Authentication ✅
- [ ] Employee login endpoint responds correctly
- [ ] Demo users can authenticate:
  - Manager: `EMP001` / `manager123`
  - Care Worker: `EMP002` / `careworker123`
  - Manager 2: `EMP003` / `manager123`
- [ ] Invalid credentials return 401
- [ ] Session cookies are set correctly

### 2. Database Connection ✅
- [ ] API endpoints can connect to database
- [ ] User queries return correct data
- [ ] No connection timeouts in production

### 3. Error Handling ✅
- [ ] 500 errors are handled gracefully
- [ ] Database connection errors are logged
- [ ] Authentication failures are properly reported

## Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**
   - Check if database is accessible
   - Verify demo users exist in database
   - Check environment variables are set correctly

2. **Database Connection Issues**
   - Verify `DATABASE_URL` and `DIRECT_URL` are correct
   - Check if Supabase is accessible from Vercel
   - Ensure database migrations have been run

3. **Prisma Client Issues**
   - Run `npx prisma generate` locally
   - Check if `src/generated/prisma` directory exists
   - Verify build process includes Prisma generation

### Debug Endpoints

- `/api/debug-auth` - Check environment variables
- Check Vercel function logs for detailed error messages

## Demo User Credentials

| Employee ID | Password | Role | Department |
|-------------|----------|------|------------|
| EMP001 | manager123 | MANAGER | Management |
| EMP002 | careworker123 | CARE_WORKER | Care |
| EMP003 | manager123 | MANAGER | Management |

## What This System Provides

✅ **Pure Prisma + Supabase authentication**  
✅ **No external Auth0 dependencies**  
✅ **Simple employee ID + password login**  
✅ **Database-driven user management**  
✅ **Production-ready deployment**  

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection locally
4. Ensure Prisma client is generated
5. Check if demo users exist in database
