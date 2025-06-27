# Vercel Deployment Guide

This guide will help you deploy your SaaS starter to Vercel using your existing GitHub repository.

## Prerequisites

- ✅ GitHub repository: `https://github.com/tjelano/Profile.git`
- ✅ Node.js 18+ installed
- ✅ Vercel account (free tier available)

## Step 1: Database Setup

You need a PostgreSQL database. Choose one of these options:

### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the connection string

### Option B: Neon (Free tier available)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string

### Option C: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string

## Step 2: Environment Variables

Set these environment variables in your Vercel project:

### Required Variables
```
POSTGRES_URL=your_postgres_connection_string
JWT_SECRET=your_32_character_random_string
NEXTAUTH_SECRET=your_32_character_random_string
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Optional Variables (for Stripe)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `tjelano/Profile`
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables (from Step 2)
6. Click "Deploy"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 4: Database Migration

After deployment, run the database migrations:

### Option A: Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Go to Functions tab
3. Create a new function or use the CLI

### Option B: Vercel CLI
```bash
# Connect to your project
vercel link

# Run migrations
vercel env pull .env.local
npm run db:migrate
```

### Option C: Direct Database Connection
```bash
# Set your production database URL locally
export POSTGRES_URL="your_production_db_url"

# Run migrations
npm run db:migrate
```

## Step 5: Verify Deployment

1. Visit your deployed URL: `https://your-app-name.vercel.app`
2. Test the sign-up/sign-in flow
3. Check that the dashboard loads correctly
4. Verify database connections

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` to your custom domain
5. Configure DNS records as instructed

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18+
- Check for TypeScript errors locally first

### Database Connection Issues
- Verify `POSTGRES_URL` is correct
- Check if database allows external connections
- Ensure SSL is properly configured

### Authentication Issues
- Verify `JWT_SECRET` and `NEXTAUTH_SECRET` are set
- Check `NEXTAUTH_URL` matches your deployment URL
- Ensure cookies are working (HTTPS required)

### Stripe Issues
- Verify webhook URL is correct: `https://your-domain.vercel.app/api/stripe/webhook`
- Check webhook secret in Stripe dashboard
- Ensure test/live keys match your environment

## Useful Commands

```bash
# Check deployment readiness
npm run deploy:check

# Test build locally
npm run build

# Run database migrations
npm run db:migrate

# Seed database (development only)
npm run db:seed

# Open Drizzle Studio
npm run db:studio
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

## Next Steps

After successful deployment:
1. Set up monitoring and analytics
2. Configure CI/CD for automatic deployments
3. Set up staging environment
4. Add custom domain and SSL
5. Configure backups for your database 