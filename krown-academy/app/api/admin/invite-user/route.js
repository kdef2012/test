import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, role, displayName, studentId } = body;

    // Use Service Role Key to bypass RLS and admin restrictions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the request came from an actively authenticated Admin
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Missing auth header' }, { status: 401 });
    
    // Extract Token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });

    // Validate if the caller's profile is truly flagged as 'admin'
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only can send invitations' }, { status: 403 });
    }

    // Trigger the Supabase Invitation email flow
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: role,
        display_name: displayName,
        student_id: studentId || null
      }
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Invitation sent successfully', user: data.user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
