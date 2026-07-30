# Civic Fix Reporter

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

A full-stack civic issue management platform that bridges citizens and local authorities. Citizens can submit and track complaints about public infrastructure, while administrators manage resolution workflows through a dedicated dashboard. Built with a modern, consolidated Next.js architecture that ships both the frontend and backend API from a single deployment.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Demo Mode](#demo-mode)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

**Citizen Portal**
- Submit civic complaints across predefined categories (Roads, Sanitation, Lighting, Water Supply, etc.)
- Upload supporting images with AI-powered verification to ensure image relevance
- Receive a unique tracking ID for each complaint submission

**Complaint Tracking**
- Real-time status updates: Pending, In Progress, and Resolved
- Full complaint history accessible via tracking ID or user account

**Admin Dashboard**
- Secure admin login with role-based access control
- View, filter, and update all submitted complaints
- Manage service categories and assign complaints to municipal officers
- Contact form submissions management

**AI Chatbot Assistant**
- Integrated AI chatbot to guide citizens through the reporting process
- Handles FAQs about complaint statuses and civic services

**Developer Experience**
- Demo Mode with in-memory data store — runs without any database configuration
- Full TypeScript coverage across all components and API routes
- RESTful API built with Next.js Route Handlers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + Shadcn/UI |
| Database | Supabase (PostgreSQL) |
| Auth | Custom JWT via Supabase |
| AI | Google Gemini API (Chatbot + Image Verification) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Architecture

This project uses a **consolidated monorepo architecture**. The Next.js App Router serves both the client-side UI pages and the server-side API routes from a single application, eliminating the need for a separate backend server or CORS configuration.

```
Browser  -->  Next.js App (Port 3000)
                  |
                  |-- /app/(routes)/    --> Server-Side Rendered Pages
                  |-- /app/api/         --> REST API Route Handlers
                  |
                  --> Supabase (PostgreSQL)
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm
- A Supabase project (optional — see [Demo Mode](#demo-mode))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/sks-007/Civic-Public-Service-System.git
cd Civic-Public-Service-System
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See [Environment Variables](#environment-variables) for details.

**4. Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase — Required for persistent data storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini — Required for AI Chatbot and Image Verification
GEMINI_API_KEY=your_gemini_api_key
```

If Supabase variables are omitted, the application will automatically switch to [Demo Mode](#demo-mode).

---

## API Reference

All endpoints are served from `/api/` via Next.js Route Handlers.

**Authentication**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new citizen account |
| POST | `/api/auth/login` | Authenticate and receive a session token |

**Complaints**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/complaints` | List all complaints (Admin) |
| POST | `/api/complaints` | Submit a new complaint |
| GET | `/api/complaints/:id` | Get a single complaint by ID |
| PUT | `/api/complaints/:id` | Update complaint status (Admin) |
| DELETE | `/api/complaints/:id` | Delete a complaint (Admin) |

**Categories & Officers**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | List all service categories |
| POST | `/api/categories` | Create a new category (Admin) |
| GET | `/api/officers` | List assigned municipal officers |

**Utilities**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chatbot` | Send a message to the AI assistant |
| POST | `/api/verify-image` | Validate complaint image via AI |
| POST | `/api/contact` | Submit a contact form message |
| GET | `/api/health` | Health check endpoint |

---

## Project Structure

```
.
├── app/
│   ├── (routes)/               # Client-facing pages
│   │   ├── admin/              # Admin dashboard and login
│   │   ├── ai-chatbot/         # AI chatbot interface
│   │   ├── complaint/          # Complaint submission form
│   │   ├── complaints/         # Complaint listing
│   │   ├── contact/            # Contact page
│   │   ├── login/              # Citizen login
│   │   ├── register/           # Citizen registration
│   │   ├── services/           # Services overview
│   │   └── track/              # Complaint tracking
│   ├── api/                    # Backend REST API route handlers
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root application layout
├── components/
│   ├── home/                   # Landing page sections
│   ├── ui/                     # Shadcn/UI primitives
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── theme-toggle.tsx
├── hooks/                      # Custom React hooks
├── lib/
│   ├── supabase.ts             # Supabase client initialisation
│   └── utils.ts                # Shared utility functions
├── styles/                     # Additional global styles
├── .env.example                # Environment variable template
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## Demo Mode

If Supabase environment variables are not configured, the application runs in **Demo Mode** using an in-memory data store. All API endpoints remain fully functional. This is ideal for local development and portfolio demonstrations.

**Demo Credentials**

| Role | Email | Password |
|---|---|---|
| Citizen | user@demo.com | demo123 |
| Admin | admin@cpss.gov | admin123 |

---

## Deployment

**Vercel (Recommended)**

The easiest way to deploy is via the Vercel platform. Connect the GitHub repository to a new Vercel project and configure the environment variables in the Vercel dashboard.

```bash
npx vercel deploy
```

**Manual / Self-Hosted**

```bash
npm run build
npm start
```

---

## Contributing

This project is actively maintained by [sks-007](https://github.com/sks-007). Issues and suggestions can be raised via the [issues page](https://github.com/sks-007/Civic-Public-Service-System/issues).