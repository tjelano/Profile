# SaaS Starter

A modern SaaS starter kit built with Next.js 15, Drizzle ORM, PostgreSQL, and Stripe.

## Features

- 🔐 Authentication with JWT
- 👥 Team management
- 💳 Stripe integration for payments
- 🎨 Modern UI with Tailwind CSS
- 📊 Activity logging
- 🔄 Real-time updates with SWR
- 🖼️ AI Image Editor with FLUX.1 Kontext Pro

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (optional)
- Replicate API token (for AI Image Editor)

### Local Development

1. Clone the repository
```bash
git clone <your-repo-url>
cd saas-starter
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Set up the database
```bash
npm run db:setup
npm run db:migrate
npm run db:seed
```

6. Start the development server
```bash
npm run dev
```

## AI Image Editor

The SaaS starter includes an AI-powered image editor using FLUX.1 Kontext Pro, a state-of-the-art text-based image editing model.

### Setup

1. Get a Replicate API token from [replicate.com](https://replicate.com)
2. Add to your `.env.local`:
   ```
   REPLICATE_API_TOKEN="r8_your_token_here"
   ```

### Usage

- Navigate to `/dashboard/image-editor`
- Upload an image (optional)
- Enter a descriptive prompt
- Adjust settings as needed
- Download your edited image

### Features

- Text-based image editing
- Multiple input/output formats
- Adjustable safety controls
- Real-time processing feedback
- Example demonstrations

See [docs/image-editor.md](docs/image-editor.md) for detailed documentation.

## Deploying to Vercel

### 1. Database Setup

You'll need a PostgreSQL database. We recommend using:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (easiest)
- [Neon](https://neon.tech) 
- [Supabase](https://supabase.com)

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard

### 3. Environment Variables

Set these in your Vercel project settings:

**Required:**
- `POSTGRES_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `NEXTAUTH_SECRET` - A secure random string for NextAuth
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

**For Stripe (optional):**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

**For AI Image Editor (optional):**
- `REPLICATE_API_TOKEN` - Your Replicate API token

### 4. Database Migration

After deployment, run the database migrations:

```bash
# In Vercel dashboard or locally with production DB
npm run db:migrate
```

### 5. Custom Domain (Optional)

1. Add your custom domain in Vercel dashboard
2. Update `NEXTAUTH_URL` to your custom domain
3. Configure DNS records as instructed by Vercel

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard routes
│   │   └── dashboard/
│   │       └── image-editor/  # AI Image Editor
│   ├── (login)/          # Authentication routes
│   └── api/              # API routes
│       └── image-edit/   # Image editing API
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── image-editor.tsx  # Main image editor
│   └── flux-example.tsx  # Example component
├── lib/                   # Utilities and configurations
│   ├── auth/             # Authentication logic
│   ├── db/               # Database setup and queries
│   ├── payments/         # Stripe integration
│   └── replicate.ts      # Replicate API utilities
└── middleware.ts         # Next.js middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:setup` - Initialize database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom JWT implementation
- **Payments**: Stripe
- **AI**: FLUX.1 Kontext Pro via Replicate
- **Styling**: Tailwind CSS
- **State Management**: SWR
- **Deployment**: Vercel

## Support

For issues and questions, please check the documentation or create an issue in the repository.