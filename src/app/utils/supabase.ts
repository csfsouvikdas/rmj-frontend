import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znyepubvxhkeoxecxjxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueWVwdWJ2eGhrZW94ZWN4anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjEsImV4cCI6MjA4NzE1NzU2MX0.AbjwXi1yKlToYEQxu-w6US3aKId2Su85f_kyz5b9Akc';

export const supabase = createClient(supabaseUrl, supabaseKey);
