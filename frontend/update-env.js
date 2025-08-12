const fs = require('fs');
const crypto = require('crypto');

// Generate a secure secret for NextAuth
const nextauthSecret = crypto.randomBytes(32).toString('hex');

// Read existing .env.local file
const envPath = '.env.local';
let envContent = '';

try {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Read existing .env.local file');
} catch (err) {
    console.log('❌ Could not read .env.local file');
    process.exit(1);
}

// Check what's missing
const missingVars = [];

if (!envContent.includes('NEXTAUTH_SECRET')) {
    missingVars.push(`NEXTAUTH_SECRET="${nextauthSecret}"`);
}

if (!envContent.includes('NEXTAUTH_URL')) {
    missingVars.push('NEXTAUTH_URL="http://localhost:3000"');
}

if (!envContent.includes('AUTH0_SCOPE')) {
    missingVars.push('AUTH0_SCOPE="openid profile email"');
}

if (!envContent.includes('AUTH0_AUDIENCE')) {
    missingVars.push('AUTH0_AUDIENCE="https://dev-vs4ybra3aeo23n8q.us.auth0.com/api/v2/"');
}

if (missingVars.length === 0) {
    console.log('✅ All required environment variables are already present');
    process.exit(0);
}

// Add missing variables
const newVars = '\n' + missingVars.join('\n');
const updatedContent = envContent + newVars;

try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ Added missing environment variables:');
    missingVars.forEach(var_ => console.log(`  - ${var_}`));
    console.log('\n📝 Your .env.local file has been updated!');
    console.log('🔄 Please restart your development server for changes to take effect.');
} catch (err) {
    console.error('❌ Failed to update .env.local file:', err.message);
    console.log('\n📝 Please manually add these variables to your .env.local file:');
    missingVars.forEach(var_ => console.log(`  ${var_}`));
}
