import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { status, reason, formType, parentEmail, studentName } = await req.json();

    if (!parentEmail || !process.env.RESEND_API_KEY) {
      return NextResponse.json({ skipped: true, note: "No email provided or missing Resend Key" });
    }

    let subject = `Application Update: ${studentName}`;
    let htmlContent = "";

    // 1. ENROLLMENT APPLICATION ACCEPTED
    if (formType === 'Enrollment Application' && status === 'Accepted') {
      subject = `🎉 Welcome to the Kingdom, ${studentName}!`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #C8A84E; text-align: center; font-family: Georgia, serif;">Welcome to the Kingdom!</h1>
          <p>Congratulations. <strong>${studentName}</strong>'s application to Krown Academy has been officially <strong>Accepted</strong>.</p>
          <p>You have taken the first step toward transforming your child's academic and athletic future. Athletics, Academics, and Mentoring—we will build a champion together.</p>
          <div style="background: #f8f9fa; border-left: 4px solid #C41E1E; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #C41E1E;">Next Steps</h3>
            <ol style="margin-bottom: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Coach Nelson will personally contact you regarding upcoming Orientation.</li>
              <li style="margin-bottom: 8px;">Ensure your NC Opportunity Scholarship application is fully submitted.</li>
              <li>Please complete the other required forms (Medical, Device Agreement) on our website if you haven't already.</li>
            </ol>
          </div>
          <p>We look forward to seeing you on campus.</p>
          <p>Best,<br/><strong>Coach Kendall Nelson</strong><br/>Krown Academy</p>
        </div>
      `;
    } 
    // 2. ENROLLMENT OR EMPLOYMENT REJECTED
    else if (status === 'Rejected') {
      subject = `Krown Academy Application: Update for ${studentName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Krown Academy Admissions</h2>
          <p>Thank you for submitting your detailed application for <strong>${studentName}</strong>.</p>
          <p>After careful review by our admissions board and Coach Nelson, we regret to inform you that we are unable to offer acceptance at this time.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; font-style: italic; color: #555;">
            "Wait for a door to open, but don't be afraid to build your own."<br/><br/>
            <strong>Note from Admissions:</strong> ${reason || "We receive highly competitive applications and unfortunately have extremely limited seating capacity (15 students maximum). We cannot accommodate every request this year."}
          </div>
          <p>We sincerely wish you the absolute best in your future endeavors.</p>
          <p>Best regards,<br/><strong>Krown Academy</strong></p>
        </div>
      `;
    }
    // 3. EMPLOYEE ACCEPTED
    else if (formType === 'Employment Application' && status === 'Accepted') {
      subject = `Welcome to the Krown Academy Team!`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C8A84E;">Welcome Aboard!</h2>
          <p>Congratulations, <strong>${studentName}</strong>! Krown Academy formally extends an offer of employment and acceptance to our team.</p>
          <p>Coach Nelson will be reaching out securely in the next 24 hours to discuss onboarding, payroll setup, and final contract execution.</p>
          <p>We are thrilled to have you join our mission of building champions within our at-risk youth.</p>
        </div>
      `;
    }
    // 4. WAITLISTED
    else if (status === 'Waitlisted') {
      subject = `Krown Academy: You are on the Waitlist`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Krown Academy Admissions</h2>
          <p>Thank you for applying to Krown Academy for <strong>${studentName}</strong>.</p>
          <p>Currently, our 15-student capacity is full. However, we have officially placed your application on our <strong>Priority Waitlist</strong>.</p>
          <p>If a seat becomes available, Coach Nelson will contact you immediately.</p>
        </div>
      `;
    } else {
      // Unhandled state, don't send anything
      return NextResponse.json({ skipped: true, note: "Unhandled status type" });
    }

    await resend.emails.send({
      from: 'Krown Academy <admissions@krownacademy.org>', // Official external notification email
      to: [parentEmail],
      subject: subject,
      html: htmlContent
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Status API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
