-- =============================================
-- Civic Complaint Portal System (CPSS)
-- Database Setup Script for Supabase
-- Project: slroxewfbxjjqmxknghn.supabase.co
-- =============================================
-- IMPORTANT: This script will DROP existing tables if they have wrong schema.
-- Run this in the Supabase SQL Editor.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DROP EXISTING TABLES (if they exist with wrong schema)
-- =============================================
DROP TABLE IF EXISTS complaint_attachments CASCADE;
DROP TABLE IF EXISTS complaint_status_history CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS authority_contacts CASCADE;
DROP TABLE IF EXISTS officers CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
DROP SEQUENCE IF EXISTS complaint_sequence CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS complaint_overview CASCADE;
DROP VIEW IF EXISTS complaint_stats CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS log_complaint_status_change() CASCADE;

-- =============================================
-- 1. SERVICE CATEGORIES TABLE
-- =============================================
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default service categories
INSERT INTO service_categories (name, description) VALUES
    ('Waste Management', 'Garbage collection, waste disposal, and sanitation issues'),
    ('Transportation', 'Road maintenance, potholes, traffic signals, and public transport'),
    ('Water & Sewage', 'Water supply issues, pipe leaks, sewage problems'),
    ('Parks & Recreation', 'Park maintenance, playground equipment, recreational facilities'),
    ('Street Lighting', 'Street light maintenance, electrical issues, public lighting');

-- =============================================
-- 2. OFFICERS TABLE
-- =============================================
CREATE TABLE officers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    designation VARCHAR(255),
    department VARCHAR(255),
    employee_id VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample officers
INSERT INTO officers (name, email, phone, address, designation, department, employee_id) VALUES
    ('Inspector Rajesh Verma', 'rajesh.verma@cpss.gov.in', '+91-9876543210', 'MG Road Office, Bangalore', 'Field Inspector', 'Street Lighting', 'EMP001'),
    ('Inspector Amit Kapoor', 'amit.kapoor@cpss.gov.in', '+91-9123456789', 'Sector 15 Office, Noida', 'Sanitation Lead', 'Waste Management', 'EMP002'),
    ('Inspector Suresh Nair', 'suresh.nair@cpss.gov.in', '+91-9988776655', 'Ring Road Office, Delhi', 'Road Maintenance Lead', 'Transportation', 'EMP003'),
    ('Inspector Kiran Desai', 'kiran.desai@cpss.gov.in', '+91-9445566778', 'FC Road Office, Pune', 'Plumbing Specialist', 'Water & Sewage', 'EMP004');

-- =============================================
-- 3. AUTHORITY CONTACTS TABLE
-- =============================================
CREATE TABLE authority_contacts (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(255),
    position VARCHAR(255),
    office_address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample authority contacts
INSERT INTO authority_contacts (fullname, email, phone, department, position, office_address) VALUES
    ('Dr. Rajesh Kumar', 'rajesh.kumar@municipal.gov.in', '+91-9876543210', 'Municipal Corporation', 'Commissioner', 'City Municipal Office, Main Block'),
    ('Mrs. Priya Sharma', 'priya.sharma@public.gov.in', 'Not Available', 'Public Works Department', 'Executive Engineer', 'PWD Office, Sector 17'),
    ('Mr. Anil Verma', 'anil.verma@water.gov.in', '+91-9123456789', 'Water Supply Department', 'Chief Engineer', 'Water Board Office'),
    ('Ms. Kavya Patel', 'kavya.patel@transport.gov.in', '+91-9988776655', 'Transportation Department', 'Joint Secretary', 'Transport Bhawan');

-- =============================================
-- 4. CREATE SEQUENCE FIRST (before complaints table)
-- =============================================
CREATE SEQUENCE complaint_sequence START 1;

-- =============================================
-- 5. COMPLAINTS TABLE
-- =============================================
CREATE TABLE complaints (
    id VARCHAR(50) PRIMARY KEY DEFAULT ('CMP-' || EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::TEXT || '-' || LPAD(nextval('complaint_sequence')::TEXT, 4, '0')),
    -- Personal Information
    fullname VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    -- Location Information
    district VARCHAR(255),
    ward VARCHAR(255),
    location_address TEXT NOT NULL,
    location TEXT,

    -- Complaint Details
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Status and Priority
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    -- Assignment and Tracking
    officer_id INTEGER REFERENCES officers(id),
    officer VARCHAR(255),
    officer_designation VARCHAR(255),
    funds_allocated DECIMAL(10,2) DEFAULT 0,

    -- Category Reference
    service_category_id INTEGER REFERENCES service_categories(id),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    complaint_source VARCHAR(50) DEFAULT 'Web Portal',
    attachments JSONB,
    notes TEXT
);

-- =============================================
-- 6. COMPLAINT STATUS HISTORY TABLE
-- =============================================
CREATE TABLE complaint_status_history (
    id SERIAL PRIMARY KEY,
    complaint_id VARCHAR(50) REFERENCES complaints(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by VARCHAR(255),
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. COMPLAINT ATTACHMENTS TABLE
-- =============================================
CREATE TABLE complaint_attachments (
    id SERIAL PRIMARY KEY,
    complaint_id VARCHAR(50) REFERENCES complaints(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_officer_id ON complaints(officer_id);
CREATE INDEX idx_complaints_service_category_id ON complaints(service_category_id);
CREATE INDEX idx_complaints_ward ON complaints(ward);
CREATE INDEX idx_complaints_priority ON complaints(priority);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update 'updated_at'
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_authority_contacts_updated_at BEFORE UPDATE ON authority_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_complaint_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by, change_reason)
        VALUES (NEW.id, OLD.status, NEW.status, 'System', 'Status updated');

        -- Set resolved_at when status becomes 'Resolved'
        IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
            NEW.resolved_at = CURRENT_TIMESTAMP;
            NEW.progress = 100;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to log status changes
CREATE TRIGGER log_complaint_status_change_trigger
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION log_complaint_status_change();

-- =============================================
-- VIEWS FOR EASY DATA ACCESS
-- =============================================

-- View for complaint overview with officer and category details
CREATE OR REPLACE VIEW complaint_overview AS
SELECT
    c.id,
    c.fullname,
    c.email,
    c.phone,
    c.ward,
    c.location_address,
    c.description,
    c.status,
    c.priority,
    c.progress,
    c.created_at,
    c.updated_at,
    c.resolved_at,
    c.funds_allocated,
    sc.name as category_name,
    o.name as officer_name,
    o.designation as officer_designation,
    o.phone as officer_phone,
    o.email as officer_email
FROM complaints c
LEFT JOIN service_categories sc ON c.service_category_id = sc.id OR c.category = sc.name
LEFT JOIN officers o ON c.officer_id = o.id
ORDER BY c.created_at DESC;

-- View for dashboard statistics
CREATE OR REPLACE VIEW complaint_stats AS
SELECT
    COUNT(*) as total_complaints,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_complaints,
    COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_complaints,
    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved_complaints,
    COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_complaints,
    COUNT(CASE WHEN priority = 'Critical' THEN 1 END) as critical_complaints,
    COUNT(CASE WHEN priority = 'High' THEN 1 END) as high_priority_complaints,
    ROUND(AVG(progress), 2) as average_progress
FROM complaints;

-- =============================================
-- ROW LEVEL SECURITY - DISABLED FOR API ACCESS
-- =============================================
-- NOTE: RLS is DISABLED so the backend can read/write using the anon key.
-- The backend server.js handles access control.
-- If you want to enable RLS later, uncomment the policies below
-- and use a service_role key in the backend instead of anon key.

ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE officers DISABLE ROW LEVEL SECURITY;
ALTER TABLE authority_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_attachments DISABLE ROW LEVEL SECURITY;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- =============================================
-- INSERT SAMPLE COMPLAINTS
-- =============================================
INSERT INTO complaints (fullname, email, phone, ward, category, location_address, location, description, status, priority, progress, officer, officer_designation, funds_allocated) VALUES
    ('Rahul Sharma', 'rahul.sharma@example.com', '+91-9876543210', 'Ward 1', 'Street Lighting', 'MG Road, Bangalore', 'MG Road, Bangalore', 'Street light has been out for 3 days near the intersection.', 'Pending', 'Medium', 25, 'Inspector Rajesh Verma', 'Field Inspector', 500),
    ('Priya Patel', 'priya.patel@example.com', '+91-9123456789', 'Ward 2', 'Waste Management', 'Sector 15, Noida', 'Sector 15, Noida', 'Garbage not collected for a week in the residential area.', 'In Progress', 'High', 60, 'Inspector Amit Kapoor', 'Sanitation Lead', 200),
    ('Arjun Kumar', 'arjun.kumar@example.com', '+91-9988776655', 'Ward 3', 'Transportation', 'Ring Road, Delhi', 'Ring Road, Delhi', 'Large pothole causing traffic issues and vehicle damage.', 'Resolved', 'Critical', 100, 'Inspector Suresh Nair', 'Road Maintenance', 1500),
    ('Sneha Reddy', 'sneha.reddy@example.com', '+91-9445566778', 'Ward 4', 'Water & Sewage', 'FC Road, Pune', 'FC Road, Pune', 'Water pipe leaking near the footpath for 2 days.', 'In Progress', 'High', 45, 'Inspector Kiran Desai', 'Plumbing Specialist', 800),
    ('Vikram Singh', 'vikram.singh@example.com', '+91-9334422111', 'Ward 5', 'Parks & Recreation', 'Cubbon Park, Bangalore', 'Cubbon Park, Bangalore', 'Broken bench and damaged playground equipment in the park.', 'Pending', 'Low', 10, NULL, NULL, 0);

-- =============================================
-- DATABASE SETUP COMPLETE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'CPSS Database Setup Complete!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - service_categories (% rows)', (SELECT COUNT(*) FROM service_categories);
    RAISE NOTICE '  - officers (% rows)', (SELECT COUNT(*) FROM officers);
    RAISE NOTICE '  - authority_contacts (% rows)', (SELECT COUNT(*) FROM authority_contacts);
    RAISE NOTICE '  - complaints (% rows)', (SELECT COUNT(*) FROM complaints);
    RAISE NOTICE '  - complaint_status_history (ready for tracking)';
    RAISE NOTICE '  - complaint_attachments (ready for files)';
    RAISE NOTICE '';
    RAISE NOTICE 'Views created:';
    RAISE NOTICE '  - complaint_overview';
    RAISE NOTICE '  - complaint_stats';
    RAISE NOTICE '';
    RAISE NOTICE 'Features enabled:';
    RAISE NOTICE '  - Auto-incrementing complaint IDs (CMP-YYYY-0001)';
    RAISE NOTICE '  - Automatic timestamp updates';
    RAISE NOTICE '  - Status change tracking';
    RAISE NOTICE '  - RLS DISABLED (backend handles access control)';
    RAISE NOTICE '  - Performance indexes';
    RAISE NOTICE '  - anon key has full read/write access';
    RAISE NOTICE '==============================================';
END $$;
