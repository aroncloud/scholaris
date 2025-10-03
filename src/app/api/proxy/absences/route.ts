import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiUrl = new URL('https://attendance-worker-dev.scholaris-sys.workers.dev/api/absences');
    
    // Copy all query parameters to the API URL
    searchParams.forEach((value, key) => {
      if (key !== 'undefined' && value !== 'undefined') {
        apiUrl.searchParams.append(key, value);
      }
    });

    console.log('Proxying request to:', apiUrl.toString());
    
    // Get headers from the original request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.error('No authorization header found in request');
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'No authorization token provided'
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    // Create headers for the external API request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader
    };

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-cache',
    });

    console.log('External API response status:', response.status);
    
    // Clone the response to be able to read it multiple times
    const responseData = await response.clone().json().catch(() => response.clone().text());
    
    // Create response headers with CORS
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (!response.ok) {
      console.error('External API error:', responseData);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: typeof responseData === 'object' ? responseData.message : 'Failed to fetch absences',
          data: responseData
        }),
        { 
          status: response.status,
          headers: responseHeaders
        }
      );
    }

    console.log('Proxied response data:', responseData);
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: responseData
      }),
      {
        status: 200,
        headers: responseHeaders
      }
    );
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

// Handle OPTIONS method for CORS preflight
// @ts-ignore
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
