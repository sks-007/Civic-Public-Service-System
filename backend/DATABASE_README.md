# Database Setup Instructions

## Supabase Project Information
- **Project Reference**: slroxewfbxjjqmxknghn
- **Project URL**: https://slroxewfbxjjqmxknghn.supabase.co
- **Setup File**: `database_setup.sql`

## How to Apply the Database Setup

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://app.supabase.com/project/slroxewfbxjjqmxknghn
2. Navigate to "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the entire content from `database_setup.sql`
5. Click "Run" to execute the script

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Apply the migration
supabase db reset --linked --project-ref slroxewfbxjjqmxknghn
```

### Option 3: Using psql (Direct Connection)
```bash
psql "postgresql://postgres:[YOUR_PASSWORD]@db.slroxewfbxjjqmxknghn.supabase.co:5432/postgres" < database_setup.sql
```

## Database Schema Overview

### 1. **service_categories**
Stores complaint categories like Waste Management, Transportation, etc.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR, UNIQUE) - Category name
- `description` (TEXT) - Category description
- `is_active` (BOOLEAN) - Active status
- `created_at`, `updated_at` (TIMESTAMP)

**Sample Data:**
- Waste Management
- Transportation
- Water & Sewage
- Parks & Recreation
- Street Lighting

### 2. **officers**
Stores information about field officers who handle complaints.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR) - Officer's full name
- `email` (VARCHAR, UNIQUE) - Officer's email
- `phone` (VARCHAR) - Contact number
- `address` (TEXT) - Office address
- `designation` (VARCHAR) - Job title
- `department` (VARCHAR) - Department name
- `employee_id` (VARCHAR, UNIQUE) - Employee ID
- `is_active` (BOOLEAN) - Active status
- `created_at`, `updated_at` (TIMESTAMP)

### 3. **authority_contacts**
Stores government authority contact information.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `fullname` (VARCHAR) - Authority's full name
- `email` (VARCHAR) - Contact email
- `phone` (VARCHAR) - Contact number
- `department` (VARCHAR) - Department
- `position` (VARCHAR) - Official position
- `office_address` (TEXT) - Office address
- `is_active` (BOOLEAN) - Active status
- `created_at`, `updated_at` (TIMESTAMP)

### 4. **complaints** (Main Table)
Stores all citizen complaints with comprehensive tracking.

**Key Columns:**
- `id` (VARCHAR) - Auto-generated ID (CMP-2026-0001)
- `fullname`, `email`, `phone` - Citizen details
- `district`, `ward` - Location details
- `location_address` - Specific location
- `category` - Complaint category
- `description` - Complaint description
- `status` - Pending/In Progress/Resolved/Closed/Rejected
- `priority` - Low/Medium/High/Critical
- `progress` - 0-100%
- `officer_id` - Assigned officer (FK)
- `funds_allocated` - Budget allocation
- `service_category_id` - Category reference (FK)
- `created_at`, `updated_at`, `resolved_at` - Timestamps

### 5. **complaint_status_history**
Tracks all status changes for complaints.

### 6. **complaint_attachments**
Stores file attachments for complaints.

## Advanced Features

### 1. **Auto-Generated Complaint IDs**
- Format: `CMP-YYYY-####` (e.g., CMP-2026-0001)
- Automatically incremented sequence

### 2. **Automatic Triggers**
- **Update Timestamps**: Automatically updates `updated_at` on record changes
- **Status Tracking**: Logs all status changes to history table
- **Auto-Resolution**: Sets `resolved_at` and `progress=100` when status becomes 'Resolved'

### 3. **Database Views**
- `complaint_overview`: Complete complaint details with officer and category info
- `complaint_stats`: Dashboard statistics (total, pending, resolved, etc.)

### 4. **Row Level Security (RLS)**
- Users can only view their own complaints
- Officers can view assigned complaints
- Admins have full access

### 5. **Performance Indexes**
Optimized indexes on frequently queried columns:
- Status, category, creation date
- Officer assignment, ward, priority

## Post-Setup Configuration

### 1. Enable Supabase Authentication
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Configure your site URL
3. Enable email confirmation if required
4. Set up social providers if needed

### 2. Update Backend Configuration
Uncomment and update your `.env` file:
```env
SUPABASE_URL=https://slroxewfbxjjqmxknghn.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Test the Setup
Run your backend server and verify:
- Complaints can be created
- Categories are loaded
- Officer assignments work
- Status updates are tracked

## Troubleshooting

### Common Issues:
1. **Permission Errors**: Ensure RLS policies are correctly applied
2. **Foreign Key Errors**: Check that referenced records exist
3. **Sequence Errors**: Restart sequence if complaint IDs fail

### Verification Queries:
```sql
-- Check if all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verify sample data
SELECT COUNT(*) FROM service_categories;
SELECT COUNT(*) FROM officers;
SELECT COUNT(*) FROM authority_contacts;

-- Test complaint creation
SELECT * FROM complaint_overview LIMIT 5;
```

## Contact
For issues with database setup, check the Supabase logs in your dashboard or contact the development team.