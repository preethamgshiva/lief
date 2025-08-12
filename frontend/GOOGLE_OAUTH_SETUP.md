# Google OAuth Setup Guide

## 🚀 Setting Up Google OAuth for Care Worker Signup

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### **Step 2: Create OAuth 2.0 Credentials**

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.vercel.app` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://your-domain.vercel.app` (for production)

### **Step 3: Get Your Client ID**

1. Copy the **Client ID** from the credentials page
2. It will look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### **Step 4: Update Environment Variables**

1. Create or update `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

2. For Vercel deployment, add this environment variable in your Vercel dashboard

### **Step 5: Test the Integration**

1. Start your development server: `npm run dev`
2. Go to the care worker signup page
3. Click "Sign up with Google"
4. Complete the OAuth flow
5. Form should auto-fill with Google profile data

## 🔧 How It Works

### **User Flow:**
1. User clicks "Sign up with Google"
2. Google OAuth popup opens
3. User selects account and authorizes
4. Google returns user profile (name, email)
5. Form auto-fills with Google data
6. User completes remaining fields and submits

### **Data Flow:**
1. Frontend sends Google credential to backend
2. Backend verifies with Google
3. User info is extracted and stored
4. Signup request is created with `signupMethod: 'GOOGLE'`
5. Managers can see which applications came through Google

## 🎯 Benefits

- **Easier signup** - One click for basic info
- **Better conversion** - Less friction
- **Professional appearance** - Modern UX
- **Data quality** - Google-verified emails
- **No cost** - Google OAuth is free

## 🚨 Important Notes

- **Never expose your client secret** in frontend code
- **Use environment variables** for sensitive data
- **Test thoroughly** before production deployment
- **Monitor usage** in Google Cloud Console
- **Comply with Google's OAuth policies**

## 🔍 Troubleshooting

### **Common Issues:**

1. **"Invalid client ID" error**
   - Check your environment variable
   - Verify client ID is correct

2. **"Redirect URI mismatch" error**
   - Update authorized redirect URIs in Google Console
   - Include both development and production URLs

3. **"API not enabled" error**
   - Enable Google+ API in Google Cloud Console

4. **Form not auto-filling**
   - Check browser console for errors
   - Verify Google OAuth is working

### **Need Help?**
- Check [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
- Review browser console for error messages
- Verify all environment variables are set correctly
