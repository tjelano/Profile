#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Vercel Deployment Setup\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI is not installed');
  console.log('Please install it with: npm i -g vercel');
  console.log('Then run: vercel login');
  process.exit(1);
}

// Generate secrets if they don't exist
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check for required environment variables
const requiredVars = [
  'POSTGRES_URL',
  'JWT_SECRET', 
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const missingVars = [];

for (const varName of requiredVars) {
  if (!envContent.includes(`${varName}=`)) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('⚠️  Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease add these to your .env.local file or set them in Vercel dashboard');
  
  if (missingVars.includes('JWT_SECRET') || missingVars.includes('NEXTAUTH_SECRET')) {
    console.log('\nGenerating secrets...');
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    const nextAuthSecret = crypto.randomBytes(32).toString('hex');
    
    envContent += `\nJWT_SECRET=${jwtSecret}`;
    envContent += `\nNEXTAUTH_SECRET=${nextAuthSecret}`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Generated JWT_SECRET and NEXTAUTH_SECRET');
  }
}

// Check database connection
if (envContent.includes('POSTGRES_URL=')) {
  console.log('\n📊 Database setup:');
  console.log('Make sure your PostgreSQL database is accessible from Vercel');
  console.log('Recommended: Use Vercel Postgres or Neon for easy setup');
}

// Stripe setup
if (envContent.includes('STRIPE_SECRET_KEY=')) {
  console.log('\n💳 Stripe setup:');
  console.log('✅ Stripe keys detected');
  console.log('Make sure to set up webhook endpoints in your Stripe dashboard');
  console.log('Webhook URL: https://your-domain.vercel.app/api/stripe/webhook');
} else {
  console.log('\n💳 Stripe setup:');
  console.log('⚠️  Stripe keys not found - payments will be disabled');
  console.log('Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to enable payments');
}

console.log('\n📋 Next steps:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your repository to Vercel');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Deploy!');

console.log('\n🔧 Commands to run:');
console.log('npm run build  # Test build locally');
console.log('vercel --prod  # Deploy to production');

console.log('\n📚 Documentation:');
console.log('https://vercel.com/docs');
console.log('https://vercel.com/docs/storage/vercel-postgres'); 