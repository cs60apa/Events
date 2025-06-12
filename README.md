# TechMeet - Tech Meetup Platform

A comprehensive platform for hosting and managing tech meetup events, built with modern web technologies.

## 🚀 Features

### Authentication & User Management

- **Role-based Signup**: Choose between Event Organizer or Attendee roles
- **Secure Authentication**: Email-based authentication system
- **User Profiles**: Complete profile management with social links and skills

### Event Management (Organizers)

- **Event Creation**: Create detailed events with all necessary information
- **Event Types**: Support for online, in-person, and hybrid events
- **Event Dashboard**: Comprehensive dashboard to manage all events
- **Event Analytics**: Track performance, registrations, and attendee engagement
- **Attendee Management**: View and manage event registrations
- **Event Editing**: Full CRUD operations for events

### Event Discovery (Attendees)

- **Browse Events**: Discover upcoming tech events
- **Event Registration**: Simple registration process
- **Event Details**: Comprehensive event information pages
- **Search & Filter**: Find events by category, type, and keywords

### Dashboard Features

- **Role-based Dashboards**: Different interfaces for organizers vs attendees
- **Notifications System**: Stay updated with event changes and reminders
- **Profile Management**: Manage personal information and preferences
- **Settings**: Customize notifications, privacy, and preferences
- **Analytics**: Detailed insights for event organizers

### Additional Features

- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Real-time Data**: Powered by Convex for real-time updates
- **TypeScript**: Fully typed for better development experience

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Convex (real-time database)
- **Authentication**: Custom auth system
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript strict mode

## 📁 Project Structure

```
/
├── app/                      # Next.js app router
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   │   ├── events/         # Event management
│   │   ├── profile/        # User profile
│   │   ├── notifications/  # Notifications
│   │   ├── settings/       # User settings
│   │   └── analytics/      # Event analytics
│   └── events/             # Public event pages
├── components/              # Reusable components
│   ├── ui/                 # shadcn/ui components
│   └── dashboard/          # Dashboard-specific components
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   ├── events.ts           # Event functions
│   ├── users.ts            # User functions
│   └── notifications.ts    # Notification functions
├── providers/              # React context providers
├── lib/                    # Utility functions
└── hooks/                  # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd events
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Convex**

   ```bash
   npx convex dev
   ```

4. **Configure environment variables**
   Create a `.env.local` file:

   ```
   CONVEX_DEPLOYMENT=your-deployment-url
   NEXT_PUBLIC_CONVEX_URL=your-convex-url
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000)

---

**Happy event organizing! 🎉**

Objective: Build a web platform where organizers can create and manage tech meetup events, and users can view events.
Features:
Organizer signup and profile management (name, company, website).
Event creation (title, description, online/in-person, location, date, opportunities).
Speaker management (name, bio, linked to events).
Public event listing page.

Tech Stack:
Frontend: Next.js (App Router, TypeScript), Tailwind CSS, Shadcn UI.
Backend/Database: Convex (real-time database, free tier).
Authentication: Clerk (free tier).
Hosting: Vercel (free tier).

Constraints: Use only free services; no paid subscriptions or resources.

Roadmap
Week 1: Project Setup & Authentication
Goals:

Set up Next.js project with Tailwind CSS, Shadcn UI, and Convex.
Implement user authentication with Clerk.
Define database schema in Convex.

Steps:

Project Initialization:
Run npx create-next-app@latest tech-meetup --typescript --tailwind --eslint.
Choose App Router, TypeScript, and Tailwind CSS during setup.
Install dependencies: npm install convex @clerk/nextjs @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate.
Initialize Shadcn UI: npx shadcn-ui@latest init.
Initialize Convex: npx convex init.

Environment Setup:
Create .env.local with Clerk and Convex API keys (obtained from their free-tier dashboards).
Example .env.local:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CONVEX_URL=https://your-convex-project.convex.cloud

Authentication with Clerk:
Set up Clerk middleware in middleware.ts.
Create sign-up/sign-in pages: app/sign-in/[[...sign-in]]/page.tsx and app/sign-up/[[...sign-up]]/page.tsx.
Sync Clerk users to Convex users table via Clerk webhooks or on user creation.

Database Schema:
Define Convex schemas for users, events, and speakers in convex/schema.ts.

Week 2: Core Features Development
Goals:

Build organizer profile management.
Implement event creation with speaker management.
Create a public event listing page.

Steps:

Organizer Profile:
Create app/profile/page.tsx for organizers to update their name, company, and website.
Use Convex mutations to save profile data.
Protect the route with Clerk’s auth() middleware.

Event Creation:
Build app/events/new/page.tsx with a form for event details (title, description, online/in-person, location, date, opportunities).
Include a section to add speakers (name, bio).
Use Shadcn UI components (Input, Textarea, Checkbox, Button) styled with Tailwind CSS.
Save events and speakers to Convex using mutations.

Event Listing:
Create app/events/page.tsx to display all events in a responsive grid.
Use Convex queries to fetch events and associated speakers.

Convex API Functions:
Create convex/events.ts and convex/speakers.ts for CRUD operations.

Week 3: UI Polish & Deployment
Goals:

Create a responsive layout with Tailwind CSS and Shadcn UI.
Deploy the app on Vercel’s free tier.

Steps:

UI Development:
Create app/layout.tsx with a navbar (links to Home, Events, Profile, Sign-in/Sign-up) and footer.
Style components with Tailwind CSS (e.g., flex, grid, sm:, md: for responsiveness).
Use Shadcn UI components for consistency (Button, Card, Input, etc.).

Event Listing Page:
Build app/events/page.tsx to display events in a grid.
Fetch events and speakers from Convex.

Deployment:
Push code to a GitHub repository (free).
Connect to Vercel via the dashboard.
Add environment variables in Vercel (Clerk and Convex keys).
Deploy: vercel --prod.

Week 4: Testing & Iteration
Goals:

Test all features for functionality and responsiveness.
Fix bugs and optimize performance.

Steps:

Testing:
Test authentication (signup, login, profile updates).
Test event creation (form validation, speaker addition).
Test event listing (data fetching, display).
Use Chrome DevTools to verify mobile responsiveness.

Optimization:
Optimize Convex queries (e.g., limit fields fetched).
Use Next.js Image component for any images to reduce load times.
Ensure minimal bundle size by avoiding heavy dependencies.

Iteration:
Gather feedback (e.g., test with friends or local community).
Fix bugs (e.g., form validation errors, UI glitches).
Add small features if time allows (e.g., event search).

Free-Tier Limits & Notes

Convex: 100k queries/month, 1GB storage. Monitor query usage in the Convex dashboard.
Clerk: Unlimited users, basic auth features. Use webhooks for user sync.
Vercel: 100GB bandwidth/month, auto-scaling. Suitable for a prototype.
Shadcn UI: No cost, customizable components.
Tailwind CSS: No external dependencies, fully free.
GitHub: Free for public/private repositories.

Best Practices

Use TypeScript for type safety with Convex and Clerk.
Keep UI simple (focus on forms and listings).
Use Git for version control: git init, git commit, push to GitHub.
Monitor free-tier usage to avoid limits (e.g., Convex queries).
Test on multiple devices (mobile, tablet, desktop) using Vercel preview URLs.

Future Enhancements

Search & Filters: Add search bar and filters (e.g., by date, location) using Convex queries.
RSVP System: Create a rsvps table in Convex for attendees.
Notifications: Use SendGrid’s free tier (100 emails/day) for event reminders.
Calendar View: Integrate react-big-calendar for a calendar UI.
Analytics: Track event views with Vercel’s analytics (free tier).

Timeline Summary

Week 1: Setup, authentication, database schema.
Week 2: Profile, event creation, speaker management, event listing.
Week 3: UI polish, deployment.
Week 4: Testing, iteration, optional features.

Troubleshooting

Clerk Issues: Check API keys and webhook setup in Clerk dashboard.
Convex Errors: Verify schema and query/mutation definitions in Convex dashboard.
Vercel Deployment Fails: Ensure environment variables are set and no build errors.
UI Bugs: Use Tailwind’s responsive classes (sm:, md:) to fix layout issues.

Resources

Next.js Docs: https://nextjs.org/docs
Tailwind CSS Docs: https://tailwindcss.com/docs
Minimize:
Shadcn UI: https://ui.shadcn.com
Convex Docs: https://docs.convex.dev
Clerk Docs: https://clerk.com/docs
Vercel Docs: https://vercel.com/docs

This guide provides a complete plan to build and deploy your tech meetup platform. Start with Week 1 tasks and progress iteratively. For additional help, refer to the official documentation or ask for specific component expansions.
