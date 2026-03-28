import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../../utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { studentId, studentName, type, category, amount, description, newBalance } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ skipped: true, note: "Missing Resend Key" });
    }

    // Attempt to find an email for the student to send the receipt to.
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', studentId).single();
    const recipientEmail = profile?.email;

    if (!recipientEmail) {
      return NextResponse.json({ skipped: true, note: "No email address found for student" });
    }

    const isDeposit = category === 'deposit';
    const color = isDeposit ? '#1D9E75' : '#C41E1E';
    const sign = isDeposit ? '+' : '-';

    await resend.emails.send({
      from: 'Krown Credit Union <banking@krownacademy.org>', // Official banking email
      to: [recipientEmail],
      subject: `KCU Transaction Alert: ${sign}$${Number(amount).toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #E8E6E0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #C8A84E; margin: 0; font-family: 'Georgia', serif; letter-spacing: 1px;">KROWN CREDIT UNION</h2>
            <p style="color: #6B6B6B; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Transaction Receipt</p>
          </div>
          
          <p>Dear ${studentName} Family,</p>
          <p>A new transaction has been posted to your Krown Credit Union account.</p>
          
          <div style="background: #F8F6F0; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${color};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #E8E6E0; padding-bottom: 10px;">
              <span style="font-weight: bold; color: #6B6B6B; font-size: 13px; text-transform: uppercase;">Amount</span>
              <span style="font-weight: 900; font-size: 20px; color: ${color};">${sign}$${Number(amount).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: bold; color: #6B6B6B; font-size: 13px; text-transform: uppercase;">Description</span>
              <span style="font-size: 15px; text-align: right;">${description}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 15px; border-top: 2px solid #E8E6E0; padding-top: 15px;">
              <span style="font-weight: bold; color: #000; font-size: 14px; text-transform: uppercase;">New Available Balance</span>
              <span style="font-weight: 900; font-size: 24px; color: #C8A84E;">$${Number(newBalance).toFixed(2)}</span>
            </div>
          </div>
          
          <p style="font-size: 13px; color: #6B6B6B; text-align: center; margin-top: 30px;">
            To view your complete transaction history, log into your KCU Portal on the Krown Academy application.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend KCU API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
