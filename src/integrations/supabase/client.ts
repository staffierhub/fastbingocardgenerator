// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wlhopipxemzceplljzsy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaG9waXB4ZW16Y2VwbGxqenN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDQ5MTAsImV4cCI6MjA0OTg4MDkxMH0.ZPATGmQOBDYtIFNH2Or0tRna0ja1FrJ0W7WLG-Tznw0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);