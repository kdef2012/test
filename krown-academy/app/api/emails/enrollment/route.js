import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { formType, appData } = await req.json();

    const parentName = appData["Parent/Guardian Name"] || appData["Parent 1 Name & Phone"] || "Parent";
    const studentName = appData["Student Full Name"] || appData["Full Name"] || "your student";
    const parentEmail = appData["Email Address"];

    // 1. Send Alert to Coach Nelson
    let adminEmailPromise = Promise.resolve();
    if (process.env.RESEND_API_KEY) {
      adminEmailPromise = resend.emails.send({
        from: 'Krown Academy <admin@krownacademy.org>', // Admin alerts send from the main domain
        to: ['knelson@krownacademy.org'],
        subject: `🚨 New ${formType}: ${studentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #000;">
            <h2 style="color: #C41E1E;">New ${formType} Received!</h2>
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Parent:</strong> ${parentName}</p>
            <p><strong>Email:</strong> ${parentEmail || 'Not Provided'}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f4f4f4; border-left: 4px solid #C8A84E;">
              <p>Log into the Krown Academy Command Center to review this application or document.</p>
              <a href="https://krownacademy.org/admin" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Go to Dashboard &rarr;</a>
            </div>
          </div>
        `
      });
    }

    // 2. Send Urgent Confirmation to Parent (If Enrollment Application)
    let parentEmailPromise = Promise.resolve();
    if (formType === 'Enrollment Application' && parentEmail && process.env.RESEND_API_KEY) {
      parentEmailPromise = resend.emails.send({
        from: 'Krown Academy Admissions <admissions@krownacademy.org>', // Official external admissions email
        to: [parentEmail],
        subject: `Action Required: Krown Academy Enrollment for ${studentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #C41E1E; margin-bottom: 5px;">KROWN ACADEMY</h1>
              <p style="letter-spacing: 2px; color: #C8A84E; font-weight: bold; font-size: 12px; text-transform: uppercase;">Application Received</p>
            </div>
            
            <p>Dear ${parentName},</p>
            <p>Thank you for submitting an Enrollment Application for <strong>${studentName}</strong>. Our admissions team (Coach Nelson) is currently reviewing your submission and will be in touch shortly.</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeeba; border-left: 5px solid #ffc107; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #856404; margin-top: 0; display: flex; align-items: center; gap: 8px;">
                ⚠️ URGENT TIME SENSITIVE ACTION REQUIRED
              </h3>
              <p style="color: #856404; font-size: 15px; line-height: 1.6;">
                Most families at Krown Academy attend for <strong>$0 out of pocket</strong>. To secure your child's funding, you must apply for the <strong>NC Opportunity Scholarship IMMEDIATELY</strong>. Funds ran out rapidly last year.
              </p>
              <div style="text-align: center; margin-top: 25px;">
                <a href="https://k12.ncseaa.edu/opportunity-scholarship/how-to-apply/" style="background: #C41E1E; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(196,30,30,0.3);">
                  Apply For Scholarship Now
                </a>
              </div>
            </div>

            <p style="font-size: 14px; color: #666;">If you have any immediate questions, please reply directly to this email or call Coach Nelson at <strong>336-500-4765</strong>.</p>
            
            <p>Welcome to the family,<br/><strong style="color: #000;">Krown Academy Admissions</strong></p>
          </div>
        `
      });
    }

    await Promise.allSettled([adminEmailPromise, parentEmailPromise]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Enrollment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
