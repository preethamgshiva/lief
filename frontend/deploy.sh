#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if Prisma client was generated successfully
if [ ! -d "src/generated/prisma" ]; then
    echo "❌ Error: Prisma client generation failed"
    exit 1
fi

echo "✅ Prisma client generated successfully"

# Build the application
echo "🏗️ Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel dashboard"
echo "2. Run database migrations: npx prisma migrate deploy"
echo "3. Set up demo users: npm run setup-db"
echo "4. Test the application"
echo ""
echo "🔐 Demo credentials:"
echo "- Manager: EMP001 / manager123"
echo "- Care Worker: EMP002 / careworker123"
echo "- Manager 2: EMP003 / manager123"
