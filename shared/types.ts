// Shared TypeScript interfaces for Civic Fix Reporter

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  ward?: string;
  created_at?: string;
}

export interface Complaint {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  ward: string;
  category: string;
  location: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  created_at: string;
  updated_at?: string;
  officer?: string;
  officer_designation?: string;
  funds_allocated?: number;
  user_id?: string;
}

export interface Category {
  id: string | number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Officer {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  designation?: string;
  created_at?: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
  ward?: string;
}

export interface ComplaintFilters {
  status?: string;
  category?: string;
  ward?: string;
  priority?: string;
  officer?: string;
  date_from?: string;
  date_to?: string;
}

export interface DemoData {
  users: User[];
  complaints: Complaint[];
  categories: Category[];
  officers: Officer[];
}