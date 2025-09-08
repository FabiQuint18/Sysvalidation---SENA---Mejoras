
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktvuzmdlodxhyqbiklzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0dnV6bWRsb2R4aHlxYmlrbHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjgxMTcsImV4cCI6MjA2NDcwNDExN30.eIsFeRPdidpJf6i235XF6__jWe32DQirTC_2-8W5NAg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
