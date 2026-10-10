import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const goal = data.get('goal')?.toString() || 'Not specified';
    const message = data.get('message')?.toString().trim() || 'No message';
    const honeypot = data.get('website')?.toString();

    // Honeypot check (spam bot trap)
    if (honeypot) {
      return new Response(JSON.stringify({ message: 'Submission received.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validation
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ message: 'Name and phone number are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Basic phone validation (Indian format)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return new Response(
        JSON.stringify({ message: 'Please enter a valid phone number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /*
     * ============================================
     * STORAGE / NOTIFICATION OPTIONS
     * ============================================
     *
     * Option 1: Log to server console (default — works immediately)
     * Option 2: Save to a database (add your DB client)
     * Option 3: Send email via a service like Resend, SendGrid, or Nodemailer
     * Option 4: Forward to a Google Sheet via Apps Script
     * Option 5: Use a service like Formspree (replace the form action)
     *
     * For now, we log the submission. Replace the section below
     * with your preferred storage/notification method.
     * ============================================
     */

    console.log('📩 New Enquiry:', {
      name,
      phone,
      goal,
      message,
      timestamp: new Date().toISOString(),
    });

    // Example: Save to a JSON file (uncomment and adapt as needed)
    // import { appendFile } from 'fs/promises';
    // await appendFile('./enquiries.json', JSON.stringify({ name, phone, goal, message, timestamp: new Date().toISOString() }) + '\n');

    // Example: Send email with Resend (requires RESEND_API_KEY)
    // const resend = new Resend(import.meta.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Hype The Gym <noreply@hypethegym.com>',
    //   to: 'youremail@example.com',
    //   subject: `New Enquiry from ${name}`,
    //   html: `<p><strong>Name:</strong> ${name}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Goal:</strong> ${goal}</p><p><strong>Message:</strong> ${message}</p>`,
    // });

    return new Response(
      JSON.stringify({
        message: 'Thank you! We will contact you within 24 hours.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong. Please call us directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
