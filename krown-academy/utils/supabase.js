import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xoywlfpskifihvyogekf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveXdsZnBza2lmaWh2eW9nZWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTcyMzAsImV4cCI6MjA4OTg5MzIzMH0._27U4vgZVJU0VVMMRVAIGmxskj35mgziudRnIGMUOAw';

export const supabase = createClient(supabaseUrl, supabaseKey);
