import { NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://attendance-worker-dev.scholaris-sys.workers.dev/api/justifications';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    console.log('=== JUSTIFICATION REQUEST START ===');
    console.log('Request Headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2));
    console.log('Request Body:', JSON.stringify(body, null, 2));
    console.log('Token present:', !!token);

    // Log the exact absence codes being processed
    if (body.absence_codes) {
      console.log('Processing absence codes:', body.absence_codes);
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing authentication token' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // Forward the request exactly as received to the external API
    console.log('Forwarding to external API:', EXTERNAL_API_URL);
    console.log('Request payload to external API:', JSON.stringify({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ? '[TOKEN_PRESENT]' : '[NO_TOKEN]'}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }, null, 2));

    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(body) // Forward the exact body we received
    });

    let data;
    try {
      data = await response.json();
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: data
      });
    } catch (error) {
      console.error('Error parsing response:', {
        status: response.status,
        statusText: response.statusText,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseText: await response.text().catch(() => 'Could not read response text')
      });
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to parse response',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('External API response status:', response.status);
    console.log('External API response data:', data);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error in justifications API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}
