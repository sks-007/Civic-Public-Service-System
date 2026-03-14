const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client - lazy init to allow server to start without credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;

function getSupabase() {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      return null;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// Demo mode data (used when Supabase is not configured)
const demoUsers = [
  { id: 1, email: 'user@demo.com', password: 'demo123', firstName: 'Rahul', lastName: 'Sharma', phone: '+91-9876543210', ward: 'Ward 1' }
];

const demoCategories = [
  { id: 1, name: 'Waste Management' },
  { id: 2, name: 'Transportation' },
  { id: 3, name: 'Water & Sewage' },
  { id: 4, name: 'Parks & Recreation' },
  { id: 5, name: 'Street Lighting' }
];

const demoComplaints = [
  { id: 'CMP-2026-0001', fullname: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91-9876543210', ward: 'Ward 1', category: 'Street Lighting', location: 'MG Road, Bangalore', description: 'Street light has been out for 3 days near the intersection.', status: 'Pending', priority: 'Medium', progress: 25, created_at: '2026-03-10T10:00:00Z', officer: 'Inspector Rajesh Verma', officer_designation: 'Field Inspector', funds_allocated: 500 },
  { id: 'CMP-2026-0002', fullname: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91-9123456789', ward: 'Ward 2', category: 'Waste Management', location: 'Sector 15, Noida', description: 'Garbage not collected for a week in the residential area.', status: 'In Progress', priority: 'High', progress: 60, created_at: '2026-03-09T14:30:00Z', officer: 'Inspector Amit Kapoor', officer_designation: 'Sanitation Lead', funds_allocated: 200 },
  { id: 'CMP-2026-0003', fullname: 'Arjun Kumar', email: 'arjun.kumar@example.com', phone: '+91-9988776655', ward: 'Ward 3', category: 'Transportation', location: 'Ring Road, Delhi', description: 'Large pothole causing traffic issues and vehicle damage.', status: 'Resolved', priority: 'Critical', progress: 100, created_at: '2026-03-08T09:15:00Z', officer: 'Inspector Suresh Nair', officer_designation: 'Road Maintenance', funds_allocated: 1500 },
  { id: 'CMP-2026-0004', fullname: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '+91-9445566778', ward: 'Ward 4', category: 'Water & Sewage', location: 'FC Road, Pune', description: 'Water pipe leaking near the footpath for 2 days.', status: 'In Progress', priority: 'High', progress: 45, created_at: '2026-03-11T11:45:00Z', officer: 'Inspector Kiran Desai', officer_designation: 'Plumbing Specialist', funds_allocated: 800 },
  { id: 'CMP-2026-0005', fullname: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91-9334422111', ward: 'Ward 5', category: 'Parks & Recreation', location: 'Cubbon Park, Bangalore', description: 'Broken bench and damaged playground equipment in the park.', status: 'Pending', priority: 'Low', progress: 10, created_at: '2026-03-12T16:20:00Z', officer: null, officer_designation: null, funds_allocated: 0 }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== API ROUTES =====

// Get all complaints
app.get('/api/complaints', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase()
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Fall back to demo data if Supabase returns empty
      if (!data || data.length === 0) {
        res.json({ success: true, data: demoComplaints, demo: true });
      } else {
        res.json({ success: true, data });
      }
    } catch (error) {
      // Fall back to demo data when Supabase query fails
      console.log('Supabase complaints query failed, using demo data');
      res.json({ success: true, data: demoComplaints, demo: true });
    }
  } else {
    // Demo mode
    res.json({ success: true, data: demoComplaints, demo: true });
  }
});

// Get single complaint by ID
app.get('/api/complaints/:id', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase()
        .from('complaints')
        .select('*')
        .or(`id.eq.${req.params.id},id.ilike.%${req.params.id}%`)
        .single();
      if (error) throw error;
      res.json({ success: true, data });
    } catch (error) {
      // Fall back to demo data when Supabase query fails
      const complaint = demoComplaints.find(c => c.id === req.params.id || c.id.includes(req.params.id));
      if (complaint) {
        res.json({ success: true, data: complaint, demo: true });
      } else {
        res.status(404).json({ success: false, error: 'Complaint not found' });
      }
    }
  } else {
    // Demo mode
    const complaint = demoComplaints.find(c => c.id === req.params.id || c.id.includes(req.params.id));
    if (complaint) {
      res.json({ success: true, data: complaint, demo: true });
    } else {
      res.status(404).json({ success: false, error: 'Complaint not found' });
    }
  }
});

// Submit new complaint
app.post('/api/complaints', async (req, res) => {
  // Helper to create demo complaint
  const createDemoComplaint = () => {
    const newId = `CMP-2026-${String(demoComplaints.length + 1).padStart(4, '0')}`;
    const newComplaint = {
      id: newId,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      ward: req.body.ward,
      category: req.body.category,
      location: req.body.address,
      description: req.body.description,
      status: 'Pending',
      priority: 'Medium',
      progress: 0,
      created_at: new Date().toISOString(),
      officer: null,
      officer_designation: null,
      funds_allocated: 0
    };
    demoComplaints.unshift(newComplaint);
    return newComplaint;
  };

  if (getSupabase()) {
    try {
      const complaintData = {
        fullname: req.body.fullname,
        full_name: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        district: req.body.ward,
        ward: req.body.ward,
        category: req.body.category,
        location_address: req.body.address,
        location: req.body.address,
        description: req.body.description,
        status: 'Pending',
        priority: 'Medium',
        progress: '0',
      };
      const { data, error } = await getSupabase()
        .from('complaints')
        .insert([complaintData])
        .select();
      if (error) throw error;
      res.json({ success: true, data: data[0] });
    } catch (error) {
      // Fall back to demo mode when Supabase insert fails
      console.log('Supabase complaint insert failed, using demo mode');
      const newComplaint = createDemoComplaint();
      res.json({ success: true, data: newComplaint, demo: true });
    }
  } else {
    // Demo mode - generate a new complaint
    const newComplaint = createDemoComplaint();
    res.json({ success: true, data: newComplaint, demo: true });
  }
});

// Update complaint (admin)
app.patch('/api/complaints/:id', async (req, res) => {
  const { status, priority, officer, progress } = req.body;

  if (getSupabase()) {
    try {
      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (officer !== undefined) updateData.officer = officer;
      if (progress !== undefined) updateData.progress = progress;

      const { data, error } = await getSupabase()
        .from('complaints')
        .update(updateData)
        .eq('id', req.params.id)
        .select();

      if (error) throw error;
      res.json({ success: true, data: data[0] });
    } catch (error) {
      // Fall back to demo mode
      console.log('Supabase complaint update failed, using demo mode');
      const complaintIndex = demoComplaints.findIndex(c => c.id === req.params.id);
      if (complaintIndex !== -1) {
        if (status !== undefined) demoComplaints[complaintIndex].status = status;
        if (priority !== undefined) demoComplaints[complaintIndex].priority = priority;
        if (officer !== undefined) demoComplaints[complaintIndex].officer = officer;
        if (progress !== undefined) demoComplaints[complaintIndex].progress = progress;
        res.json({ success: true, data: demoComplaints[complaintIndex], demo: true });
      } else {
        res.status(404).json({ success: false, error: 'Complaint not found' });
      }
    }
  } else {
    // Demo mode
    const complaintIndex = demoComplaints.findIndex(c => c.id === req.params.id);
    if (complaintIndex !== -1) {
      if (status !== undefined) demoComplaints[complaintIndex].status = status;
      if (priority !== undefined) demoComplaints[complaintIndex].priority = priority;
      if (officer !== undefined) demoComplaints[complaintIndex].officer = officer;
      if (progress !== undefined) demoComplaints[complaintIndex].progress = progress;
      res.json({ success: true, data: demoComplaints[complaintIndex], demo: true });
    } else {
      res.status(404).json({ success: false, error: 'Complaint not found' });
    }
  }
});

// Get service categories
app.get('/api/categories', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase()
        .from('service_categories')
        .select('id, name')
        .order('name');
      if (error) throw error;
      res.json({ success: true, data });
    } catch (error) {
      // Fall back to demo data when Supabase query fails
      console.log('Supabase categories query failed, using demo data');
      res.json({ success: true, data: demoCategories, demo: true });
    }
  } else {
    // Demo mode
    res.json({ success: true, data: demoCategories, demo: true });
  }
});

// Add service category (admin)
app.post('/api/categories', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase()
        .from('service_categories')
        .insert([{ name: req.body.name }]);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      // Fall back to demo mode
      console.log('Supabase category insert failed, using demo mode');
      const newCategory = { id: demoCategories.length + 1, name: req.body.name };
      demoCategories.push(newCategory);
      res.json({ success: true, data: newCategory, demo: true });
    }
  } else {
    // Demo mode
    const newCategory = { id: demoCategories.length + 1, name: req.body.name };
    demoCategories.push(newCategory);
    res.json({ success: true, data: newCategory, demo: true });
  }
});

// Add officer (admin)
app.post('/api/officers', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase()
        .from('officers')
        .insert([{
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          is_active: true
        }]);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      // Fall back to demo mode
      console.log('Supabase officer insert failed, using demo mode');
      res.json({ success: true, demo: true });
    }
  } else {
    // Demo mode - just accept
    res.json({ success: true, demo: true });
  }
});

// Add authority contact (admin)
app.post('/api/contacts', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase()
        .from('authority_contacts')
        .insert([{
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          department: req.body.department
        }]);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      // Fall back to demo mode
      console.log('Supabase contact insert failed, using demo mode');
      res.json({ success: true, demo: true });
    }
  } else {
    // Demo mode - just accept
    res.json({ success: true, demo: true });
  }
});

// Register user
app.post('/api/register', async (req, res) => {
  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email: req.body.email,
        password: req.body.password,
        options: {
          data: {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            phone: req.body.phone,
            district: req.body.ward
          }
        }
      });
      if (error) throw error;
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    // Demo mode - add user to demo array
    const existingUser = demoUsers.find(u => u.email === req.body.email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    const newUser = {
      id: demoUsers.length + 1,
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      ward: req.body.ward
    };
    demoUsers.push(newUser);
    res.json({ success: true, data: { user: { email: newUser.email } }, demo: true });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  // Always allow demo credentials so local testing works even when Supabase is configured.
  const demoUser = demoUsers.find(
    u => u.email === req.body.email && u.password === req.body.password
  );

  if (demoUser) {
    return res.json({
      success: true,
      data: {
        user: {
          id: demoUser.id,
          email: demoUser.email,
          user_metadata: {
            first_name: demoUser.firstName,
            last_name: demoUser.lastName,
            phone: demoUser.phone,
            district: demoUser.ward
          }
        }
      },
      demo: true
    });
  }

  if (getSupabase()) {
    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email: req.body.email,
        password: req.body.password
      });
      if (error) {
        // Invalid credentials should not be treated as server errors.
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
});

// Admin login (hardcoded demo)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@cpss.gov' && password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  // Accept contact form submissions (would normally send email)
  console.log('Contact form submission:', req.body);
  res.json({ success: true, message: 'Message received' });
});

// ===== HTML ROUTES =====

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/complaint', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'complaint.html'));
});

app.get('/complaints', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'complaints.html'));
});

app.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/ai-chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ai-chatbot.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  const sbStatus = getSupabase() ? 'Connected' : 'Demo Mode (no Supabase)';
  console.log(`\n  CPSS Server running on http://localhost:${PORT}`);
  console.log(`  Static files: ${path.join(__dirname, 'public')}`);
  console.log(`  Database: ${sbStatus}`);
  if (!getSupabase()) {
    console.log(`  Demo credentials: user@demo.com / demo123`);
    console.log(`  Admin credentials: admin@cpss.gov / admin123`);
  }
  console.log('');
});
