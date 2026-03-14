# Civic Fix Reporter - Backend (Express.js)

A robust Express.js backend API with static HTML frontend for the Civic Fix Reporter system.

## Technology Stack

- **Framework**: Express.js 4.18.2
- **Runtime**: Node.js
- **Database**: Supabase integration
- **Features**: CORS enabled, Demo mode, Static file serving

## Features

- 🔐 User authentication API
- 📝 Complaints CRUD operations
- 👨‍💼 Officer management (Admin)
- 📊 Categories management
- 📧 Contact form handling
- 🚀 Demo mode (works without Supabase)
- 🌐 CORS enabled for cross-origin requests
- 📱 Static HTML frontend included

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run with demo data
NODE_ENV=demo npm start
```

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   PORT=5000
   ```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout

### Complaints
- `GET /api/complaints` - List all complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Officers (Admin only)
- `GET /api/officers` - List all officers
- `POST /api/officers` - Add new officer
- `GET /api/officers/:id` - Get specific officer
- `PUT /api/officers/:id` - Update officer
- `DELETE /api/officers/:id` - Remove officer

### Categories
- `GET /api/categories` - List service categories
- `POST /api/categories` - Add new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Remove category

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - List contact submissions (Admin)

### Utility
- `GET /health` - Health check endpoint
- `GET /api/demo/reset` - Reset demo data

## Project Structure

```
├── server.js              # Main Express application
├── public/                # Static HTML files
│   ├── index.html         # Homepage
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── complaint.html     # Complaint form
│   ├── complaints.html    # Complaints list
│   ├── admin.html         # Admin dashboard
│   ├── css/              # Stylesheets
│   └── js/               # Client-side JavaScript
├── server/                # Server-side modules (optional)
└── package.json          # Dependencies and scripts
```

## Demo Mode

The application includes a demo mode that works without Supabase:

```bash
NODE_ENV=demo npm start
```

Demo mode features:
- In-memory data storage
- Sample complaints and users
- All API endpoints functional
- Perfect for testing and demonstrations

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Complaints Table
```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Officers Table
```sql
CREATE TABLE officers (
  id UUID PRIMARY KEY,
  name TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Development

### Adding New Routes
```javascript
app.get('/api/new-endpoint', (req, res) => {
  // Handle request
  res.json({ message: 'Success' });
});
```

### Middleware
- CORS enabled for all origins
- JSON body parsing
- Static file serving

## Deployment

### Heroku
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Railway
```bash
railway login
railway init
railway up
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Frontend Integration

The backend serves both API endpoints and static HTML files:

- **API**: Available at `/api/*` endpoints
- **HTML**: Static files served from `/public` directory
- **Assets**: CSS and JavaScript files in `/public/css` and `/public/js`

## Security

- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Input validation on all endpoints
- SQL injection prevention through Supabase client

## Testing

```bash
# Test API endpoints
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## Troubleshooting

### Common Issues

1. **Port in use**: Change PORT in `.env` file
2. **Supabase connection**: Verify credentials in `.env`
3. **CORS errors**: Check CORS configuration
4. **Demo mode**: Use `NODE_ENV=demo` for testing

### Logs

Enable detailed logging:
```bash
DEBUG=* npm start
```

## Contributing

1. Follow Express.js best practices
2. Validate all input data
3. Use environment variables for configuration
4. Maintain backward compatibility
5. Update API documentation