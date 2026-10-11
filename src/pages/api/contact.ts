import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim()
      || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
      || new URL(request.url).protocol.replace(':', '');

    if (!origin || !host || new URL(origin).host !== host || new URL(origin).protocol !== `${protocol}:`) {
      return new Response(
        JSON.stringify({ message: 'Cross-site form submissions are forbidden.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    const webhookUrl = import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const webhookSecret = import.meta.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

    if (!webhookUrl || !webhookSecret) {
      console.error('Google Sheets webhook environment variables are missing.');
      return new Response(
        JSON.stringify({ message: 'Enquiry saving is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: webhookSecret,
        name,
        phone,
        goal,
        message,
      }),
    });

    const webhookResult = await webhookResponse.json().catch(() => null);

    if (!webhookResponse.ok || webhookResult?.ok !== true) {
      console.error('Google Sheets webhook failed:', webhookResult);
      return new Response(
        JSON.stringify({ message: 'Could not save your enquiry. Please call us directly.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
