# Subscription Management Application

A comprehensive web application for managing subscriptions with Stripe integration, user authentication, and subscription lifecycle management.

## Features

- **User Authentication** - Secure login and registration using Clerk.
- **Subscription Plans** - Pre-defined subscription plans (Free, Pro, Enterprise).
- **Stripe Integration** - Payment processing and subscription management.
- **Dashboard** - View and manage active subscriptions.
- **Admin Panel** - Manage users and subscriptions (Coming soon).
- **Email Notifications** - Subscription confirmation and reminders.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: Clerk
- **Payments**: Stripe
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Forms**: React Hook Form, Zod

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd subscription-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## Usage

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
subscription-app/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Authentication pages
│   ├── dashboard/              # Dashboard pages
│   ├── api/                    # API routes
│   └── layout.tsx              # Root layout
├── components/                 # Reusable components
│   ├── auth/                   # Authentication components
│   ├── ui/                     # Shadcn UI components
│   ├── subscriptions/          # Subscription components
│   └── dashboard/              # Dashboard components
├── lib/                        # Application logic
│   ├── prisma/                 # Prisma client
│   ├── stripe/                 # Stripe integration
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── prisma/                     # Prisma schemas
├── .env.local                  # Environment variables (local)
└── README.md                   # Project documentation
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL database connection string |
| `CLERK_SECRET_KEY` | Clerk secret key for server-side operations |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk sign-in page URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk sign-up page URL |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification secret |
| `NEXT_PUBLIC_SITE_URL` | Application site URL |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Lint code |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma client |

## License

This project is licensed under the MIT License.
