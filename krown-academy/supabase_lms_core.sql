-- =================================================================================
-- KROWN ACADEMY: MASTER LMS CORE & TELEMETRY ARCHITECTURE
-- Run this in your Supabase SQL Editor to establish the LMS backend
-- =================================================================================

-- 1. COURSES DIRECTORY
CREATE TABLE IF NOT EXISTS public.krown_lms_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    subject_category TEXT NOT NULL, -- e.g., 'Math', 'ELA', 'Elective'
    grade_level TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    credits NUMERIC(3,1) DEFAULT 1.0,
    is_published BOOLEAN DEFAULT false
);

-- 2. COURSE MODULES (The Nodes on the Skill Tree)
CREATE TABLE IF NOT EXISTS public.krown_lms_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.krown_lms_courses(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_standards TEXT[], -- Array of standard codes e.g. {"8.EE.1", "8.EE.2"}
    unlocks_next BOOLEAN DEFAULT true
);

-- 3. THE CONTENT / LESSONS
CREATE TABLE IF NOT EXISTS public.krown_lms_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.krown_lms_modules(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'text', 'video', 'sandbox', 'socratic_chat'
    content_payload JSONB NOT NULL, -- The rich AI-generated text, video URLs, or custom Sandbox variables
    estimated_minutes INTEGER DEFAULT 15
);

-- 4. STUDENT PROGRESS (The Gamified Knight's Armor)
CREATE TABLE IF NOT EXISTS public.krown_lms_student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL, -- Links to public.students(id) if standard string ID, or UUID
    lesson_id UUID REFERENCES public.krown_lms_lessons(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Not Started', -- 'In Progress', 'Mastered', 'Stuck'
    score_percentage INTEGER,
    failed_attempts INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, lesson_id)
);

-- 5. KROWN TELEMETRY (Passive Attendance & Compliance Logs)
CREATE TABLE IF NOT EXISTS public.krown_lms_telemetry_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    course_id UUID REFERENCES public.krown_lms_courses(id) ON DELETE SET NULL,
    session_date DATE DEFAULT CURRENT_DATE NOT NULL,
    active_seconds INTEGER DEFAULT 0 NOT NULL, -- The aggregate pinged seconds
    status TEXT DEFAULT 'Active',
    last_ping_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id, session_date)
);

-- 6. THE TREASURY & ECONOMY
CREATE TABLE IF NOT EXISTS public.krown_lms_economy (
    student_id TEXT PRIMARY KEY,
    swords_earned INTEGER DEFAULT 0,
    krown_coin_balance NUMERIC(10,2) DEFAULT 0.00,
    lifetime_krown_coin NUMERIC(10,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CLERICAL WPM (Elective Logs)
CREATE TABLE IF NOT EXISTS public.krown_clerical_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    wpm_score INTEGER NOT NULL,
    accuracy_percentage NUMERIC(5,2) NOT NULL,
    krown_coin_rewarded NUMERIC(10,2) DEFAULT 0.00
);

-- =================================================================================
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- =================================================================================
ALTER TABLE public.krown_lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krown_lms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krown_lms_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krown_lms_student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krown_lms_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krown_lms_economy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krown_clerical_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------------
-- RELAXED PUBLIC POLICIES FOR INITIAL LMS DEVELOPMENT (Tethered to Krown App logic)
-- *Note: In full production, these would be explicitly tied to auth.uid() matching student_id
-- ---------------------------------------------------------------------------------
CREATE POLICY "Allow public read-only access to courses" ON public.krown_lms_courses FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to modules" ON public.krown_lms_modules FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to lessons" ON public.krown_lms_lessons FOR SELECT USING (true);

-- Allow admins full access, and allow students to view/update their own logs (Simulated as true for rapid prototype)
CREATE POLICY "Enable read/write for progress" ON public.krown_lms_student_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for telemetry" ON public.krown_lms_telemetry_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for economy" ON public.krown_lms_economy FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for clerical logs" ON public.krown_clerical_logs FOR ALL USING (true) WITH CHECK (true);
