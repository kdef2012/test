import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../../utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { studentId, businessName, requestedAmount, matchOption } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ skipped: true, note: "Missing Resend Key" });
    }

    const { data: stu } = await supabase.from('students').select('name').eq('id', studentId).single();
    const studentName = stu?.name || "A Student";

    await resend.emails.send({
      from: 'KCU Investment Board <banking@krownacademy.org>', // Official board representation
      to: ['knelson@krownacademy.org'],
      subject: `🚨 New Pitch Deck: ${businessName} by ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a;">
          <h2 style="color: #C8A84E;">New Business Plan Submitted!</h2>
          <p><strong>${studentName}</strong> has just submitted a formal pitch deck to the Krown Credit Union Investment Board.</p>
          
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C41E1E;">
            <p style="margin: 0 0 10px 0;"><strong>Venture Name:</strong> ${businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Capital Requested:</strong> $${Number(requestedAmount).toFixed(2)}</p>
            <p style="margin: 0;"><strong>Match Strategy:</strong> ${matchOption}</p>
          </div>
          
          <p>Please log into the KCU Admin Command Center to review their executive summary, marketing plan, and risk assessment.</p>
          <a href="https://krownacademy.org/admin/kcu" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Open KCU Admin &rarr;</a>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Business API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
