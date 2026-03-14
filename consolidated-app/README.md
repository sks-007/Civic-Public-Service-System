# Civic Fix Reporter - Consolidated Application

## **🎯 Single Modern Application (Next.js with API Routes)**

This is the **consolidated modern version** of the Civic Fix Reporter system, combining both frontend and backend functionality into a single Next.js application.

## **Architecture Overview**

- **Frontend**: Next.js 16.1.6 with React 19.2.4
- **Backend**: Next.js API Routes (replaces Express.js)
- **Database**: Supabase integration + Demo mode fallback
- **Styling**: Tailwind CSS 4.2.0 + Shadcn/ui
- **Deployment**: Single application deployment

## **✨ Features**

### **Core Functionality**
- 🔐 User Authentication (Register/Login)
- 📝 Complaint Submission and Management
- 🔍 Complaint Tracking with Real-time Updates
- 👨‍💼 Administrative Dashboard
- 📊 Categories Management
- 📧 Contact Form Integration
- 🤖 AI Chatbot Interface
- ⚡ Demo Mode (works without database)

### **Technical Features**
- 📱 Fully Responsive Design
- 🌙 Dark Mode Support
- 🚀 Optimized Performance
- 🔄 Real-time Data Synchronization
- 📊 Health Monitoring
- 🛡️ Type-Safe API with TypeScript
- ⚡ Server-Side Rendering (SSR)
- 🎨 Modern UI Components

## **🚀 Quick Start**

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

**Access the application:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

## **📁 Project Structure**

```
consolidated-app/
├── app/                        # Next.js App Router
│   ├── api/                   # API Routes (Backend)
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/         # POST /api/auth/login
│   │   │   └── register/      # POST /api/auth/register
│   │   ├── complaints/        # Complaint management
│   │   │   ├── [id]/          # GET/PUT/DELETE /api/complaints/:id
│   │   │   └── route.ts       # GET/POST /api/complaints
│   │   ├── categories/        # Service categories
│   │   │   └── route.ts       # GET/POST /api/categories
│   │   ├── contact/           # Contact form
│   │   │   └── route.ts       # GET/POST /api/contact
│   │   └── health/            # Health check
│   │       └── route.ts       # GET /api/health
│   ├── (routes)/              # Frontend Pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── complaint/         # Complaint submission
│   │   ├── complaints/        # Complaint listing
│   │   ├── login/             # Authentication
│   │   ├── track/             # Complaint tracking
│   │   └── ...
│   └── layout.tsx             # Root layout
├── components/                # React Components
│   ├── ui/                    # Shadcn/ui components
│   ├── home/                  # Home-specific components
│   └── ...
├── lib/                       # Utilities
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Helper functions
├── styles/                    # Global styles
└── shared/                    # Shared types/interfaces
```

## **🔧 Environment Configuration**

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Development settings
NODE_ENV=development
```

## **📡 API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### **Complaints**
- `GET /api/complaints` - List all complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### **Categories**
- `GET /api/categories` - List service categories
- `POST /api/categories` - Create new category (Admin)

### **Contact**
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List submissions (Admin)

### **Utility**
- `GET /api/health` - Health check endpoint

## **🎭 Demo Mode**

The application automatically falls back to demo mode when Supabase is not configured:

```bash
# Works without database setup
npm run dev
```

**Demo Features:**
- In-memory data storage
- Sample complaints and users
- All API endpoints functional
- Perfect for testing and development

**Demo Credentials:**
- User: `user@demo.com` / `demo123`
- Admin: `admin@cpss.gov` / `admin123`

## **🏗️ Development**

### **Adding New API Routes**

```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Handle POST request
  return NextResponse.json({ success: true, data: body });
}
```

### **Adding New Pages**

```typescript
// app/(routes)/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### **Using API in Components**

```typescript
// Fetch data in component
const response = await fetch('/api/complaints');
const data = await response.json();
```

## **🚀 Deployment**

### **Vercel (Recommended)**

```bash
# Deploy to Vercel
npx vercel deploy

# Or connect GitHub repository to Vercel dashboard
```

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Docker Deployment**

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## **🧪 Testing**

### **API Testing**

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test complaints endpoint
curl -X POST http://localhost:3000/api/complaints \\
  -H "Content-Type: application/json" \\
  -d '{"fullname":"Test User","email":"test@example.com","category":"Test","location":"Test Location","description":"Test complaint"}'
```

### **Frontend Testing**

1. Navigate to http://localhost:3000
2. Test user registration and login
3. Submit a complaint
4. Access admin dashboard
5. Test AI chatbot functionality

## **🔄 Migrating from Other Versions**

### **From Express.js Backend**
- API routes automatically migrated
- Database schema remains the same
- Demo mode preserved

### **From Separate Frontend/Backend**
- Combine both projects into single deployment
- Update API endpoints to use relative paths
- Consolidate environment variables

## **📊 Performance**

- **SSR/SSG**: Optimized page loading
- **API Routes**: Server-side API in same deployment
- **Build Size**: Optimized with Next.js compiler
- **Caching**: Automatic Next.js caching strategies

## **🛠️ Troubleshooting**

### **Common Issues**

1. **Build Errors**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **API Route Issues**
   ```bash
   # Check route file naming
   # Ensure route.ts files export named functions
   ```

3. **Supabase Connection**
   ```bash
   # Verify environment variables
   # Check Supabase URL and key format
   ```

### **Debug Mode**

```bash
# Enable debug logging
DEBUG=* npm run dev
```

## **🤝 Contributing**

1. Follow Next.js conventions
2. Use TypeScript for all files
3. Ensure mobile responsiveness
4. Test both Supabase and demo modes
5. Update documentation for changes

---

## **📚 Related Versions**

This repository contains **four different implementations** of the same application:

1. **Basic Cleanup** (`/`) - Cleaned up original structure
2. **Frontend/Backend** (`frontend/`, `backend/`) - Separate clean applications
3. **Client/Server** (`client/`, `server/`) - API server + frontend client
4. **Consolidated** (`consolidated-app/`) - **This application** - Single modern app

Choose the architecture that best fits your deployment needs!

---

**🎉 Civic Fix Reporter - Making cities more responsive to citizen needs!**