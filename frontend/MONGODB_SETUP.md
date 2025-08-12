# 🚀 MongoDB Atlas Setup Guide

## 📋 **Prerequisites**
- MongoDB Atlas account (free tier available)
- Node.js and npm installed

## 🔧 **Step 1: Create MongoDB Atlas Account**

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

## 🗄️ **Step 2: Create Database Cluster**

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

## 🔐 **Step 3: Create Database User**

1. In the Security section, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## 🌐 **Step 4: Get Connection String**

1. In the Security section, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Go back to "Database" section
5. Click "Connect"
6. Choose "Connect your application"
7. Copy the connection string

## 📝 **Step 5: Update Environment Variables**

1. Create/update your `.env.local` file:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/lief_care?retryWrites=true&w=majority"
```

2. Replace:
   - `username` with your database username
   - `password` with your database password
   - `cluster.mongodb.net` with your actual cluster URL
   - `lief_care` with your preferred database name

## 🚀 **Step 6: Setup Database**

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Push Schema to MongoDB:**
   ```bash
   npm run db:push
   ```

3. **Setup Sample Data:**
   ```bash
   npm run setup-db
   ```

4. **Test Connection:**
   ```bash
   npm run test-db
   ```

## ✅ **Step 7: Start Development Server**

```bash
npm run dev
```

## 🔑 **Default Login Credentials**

After setup, you can login with:

- **Manager:** `MGR001` / `manager123`
- **Employees:** `EMP001`, `EMP002`, `EMP003` / `employee123`

## 🆘 **Troubleshooting**

### **Connection Failed**
- Check your DATABASE_URL format
- Verify username/password
- Ensure IP address is whitelisted

### **Schema Push Failed**
- Make sure MongoDB Atlas is accessible
- Check if database user has write permissions

### **Prisma Client Issues**
- Run `npm run db:generate` again
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📚 **MongoDB Atlas Features**

- **Free Tier:** 512MB storage, shared RAM
- **Auto-scaling:** Automatic resource management
- **Backup:** Automated daily backups
- **Monitoring:** Real-time performance metrics
- **Security:** Built-in authentication and encryption

---

**Need Help?** Check MongoDB Atlas documentation or create an issue in the repository.
