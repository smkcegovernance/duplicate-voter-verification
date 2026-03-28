import { NextRequest, NextResponse } from 'next/server';
import { signRequest } from '@/lib/hmac';
import { maybeEnableInsecureLocalhostTls } from '@/lib/tls';

// Use server-side environment variables in production
const API_BASE_URL = process.env.BASE_URL || '';
const API_KEY = process.env.API_KEY || 'TEST_API_KEY_12345678901234567890123456789012';
const SECRET_KEY = process.env.SECRET_KEY || 'TEST_SECRET_KEY_67890ABCDEFGHIJ1234567890';

function buildApiUrl(apiPath: string): string {
  const base = (API_BASE_URL || '').replace(/\/+$/, '');
  let path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  const baseHasApi = /\/api$/i.test(base);
  const pathStartsWithApi = /^\/api\//i.test(path);
  if (baseHasApi && pathStartsWithApi) {
    path = path.replace(/^\/api/i, '');
  }
  return `${base}${path}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requirementId } = await params;

    // Validate requirement ID
    if (!requirementId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Requirement ID is required',
          error: 'INVALID_PARAMETER',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON in request body',
          error: 'INVALID_REQUEST',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate authorizedBy field
    if (!body.authorizedBy) {
      return NextResponse.json(
        {
          success: false,
          message: 'authorizedBy is required',
          error: 'INVALID_REQUEST',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Prepare request for external API
    const apiUrl = buildApiUrl(`/api/deposits/account/requirements/${requirementId}/publish`);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const requestBody = JSON.stringify(body);

    // Generate HMAC signature
    const signature = signRequest(
      'POST',
      `/api/deposits/account/requirements/${requirementId}/publish`,
      requestBody,
      timestamp,
      API_KEY,
      SECRET_KEY
    );

    // Make request to external API
    maybeEnableInsecureLocalhostTls(apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
      body: requestBody,
    });

    // Handle response based on status code
    if (response.status === 204) {
      // Success - No Content
      return new NextResponse(null, { status: 204 });
    }

    // For other status codes, try to parse JSON response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = {
        success: false,
        message: 'Unexpected response from server',
        timestamp: new Date().toISOString(),
      };
    }

    // Return the response with appropriate status code
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Error publishing requirement:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
