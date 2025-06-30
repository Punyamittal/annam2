export interface MilkRecord {
  id: string;
  date: string;
  morning_milk: number;
  evening_milk: number;
  total_milk: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyTotal {
  month: string;
  total_milk: number;
  morning_total: number;
  evening_total: number;
  average_daily: number;
  highest_day: number;
  lowest_day: number;
  record_count: number;
  archived_at: string;
}

// src/types/index.ts

// Add these interfaces to the existing types file
export interface Cow {
  id: string;
  tag_number: string;
  name?: string;
  gender: 'Male' | 'Female';
  date_of_birth?: string;
  color: string;
  markings?: string;
  age_category: 'Adult' | 'Calf'; // Add this field
  status: 'Active' | 'Sold' | 'Deceased';
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  cow_id: string;
  date: string;
  record_type: 'Vaccination' | 'Treatment' | 'Checkup';
  description: string;
  medicines?: string[];
  vet_name?: string;
  next_followup?: string;
  created_at: string;
  updated_at: string;
}

export interface BreedingRecord {
  id: string;
  cow_id: string;
  date: string;
  record_type: 'AI' | 'Natural';
  pregnancy_status?: 'Unknown' | 'Confirmed' | 'Not Pregnant';
  pregnancy_check_date?: string;
  calving_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
export interface RecordBase {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface MilkRecord extends RecordBase {
  date: string;
  morning_milk: number;
  evening_milk: number;
  total_milk: number;
  user_id: string;
}