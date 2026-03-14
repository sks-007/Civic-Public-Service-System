# Civic Fix Reporter - Frontend (Next.js)

A modern React-based frontend for the Civic Fix Reporter system.

## Technology Stack

- **Framework**: Next.js 16.1.6 with React 19.2.4
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS 4.2.0
- **UI Components**: Shadcn/ui (New York style) + Radix UI
- **Backend**: Supabase integration
- **Deployment**: Vercel/Netlify ready

## Features

- 🔐 User authentication (register/login)
- 📝 Complaint submission and management
- 🔍 Complaint tracking system
- 👨‍💼 Administrative dashboard
- 🤖 AI chatbot integration
- 📱 Fully responsive design
- 🌙 Dark mode support
- ⚡ Optimized performance

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages
│   ├── complaint/         # Complaint submission
│   ├── login/             # Authentication
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   ├── home/             # Home-specific components
│   └── navbar.tsx        # Navigation component
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configuration
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper utilities
└── styles/               # Global CSS styles
```

## Routes

- `/` - Homepage
- `/login` - User login
- `/register` - User registration
- `/complaint` - Submit new complaint
- `/complaints` - View all complaints
- `/track` - Track complaint status
- `/admin` - Administrative dashboard
- `/admin/login` - Admin login
- `/ai-chatbot` - AI assistance
- `/contact` - Contact information
- `/services` - Municipal services

## Development

### Adding New Pages
```bash
# Create new page in app directory
touch app/new-page/page.tsx
```

### Adding UI Components
```bash
# Add Shadcn/ui components
npx shadcn-ui@latest add button card dialog
```

### Customizing Theme
Edit `tailwind.config.js` and `components.json` for theme customization.

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Manual Deployment
```bash
npm run build
npm start
```

## Backend Integration

This frontend connects to the backend API. Ensure the backend service is running:

- **Development**: Backend runs on `http://localhost:5000`
- **Production**: Configure API endpoint in environment variables

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all environment variables are set
2. **Supabase Connection**: Verify credentials in `.env.local`
3. **Import Errors**: Check TypeScript configuration
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Development Tools

- Chrome DevTools for debugging
- React Developer Tools extension
- Next.js built-in performance monitoring

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Ensure responsive design
4. Test across different browsers
5. Update documentation as needed