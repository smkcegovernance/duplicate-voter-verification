import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import { maybeEnableInsecureLocalhostTls } from '@/lib/tls';

// Server-side environment variables
const API_BASE_URL = process.env.BASE_URL || 'https://localhost:5443/api';
const API_KEY = process.env.API_KEY || 'TEST_API_KEY_12345678901234567890123456789012';
const SECRET_KEY = process.env.SECRET_KEY || 'TEST_SECRET_KEY_67890ABCDEFGHIJ1234567890';

function buildApiUrl(apiPath: string): string {
  const base = (API_BASE_URL || '').replace(/\/+$|\/+$/g, '');
  let path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  const baseHasApi = /\/api$/i.test(base);
  const pathStartsWithApi = /^\/api\//i.test(path);
  if (baseHasApi && pathStartsWithApi) {
    path = path.replace(/^\/api/i, '');
  }
  return `${base}${path}`;
}

function generateHmacSignature(method: string, uri: string, body: string, timestamp: string): string {
  const stringToSign = method + uri + body + timestamp + API_KEY;
  return CryptoJS.HmacSHA256(stringToSign, SECRET_KEY).toString(CryptoJS.enc.Base64);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get('requirementId') || '';
    const bankId = searchParams.get('bankId') || '';
    const fileName = searchParams.get('fileName') || '';

    if (!requirementId || !bankId || !fileName) {
      return NextResponse.json({ success: false, message: 'Missing query params', data: null }, { status: 400 });
    }

    const isPdf = /\.pdf$/i.test(fileName);
    const isJpg = /\.(jpg|jpeg)$/i.test(fileName);
    // Prefer specific media types for better upstream negotiation
    const acceptType = isPdf ? 'application/pdf' : isJpg ? 'image/jpeg' : 'application/json';

    const apiQuery = new URLSearchParams();
    apiQuery.append('requirementId', requirementId);
    apiQuery.append('bankId', bankId);
    apiQuery.append('fileName', fileName);

    const apiPath = `/api/deposits/consent/downloadconsent?${apiQuery.toString()}`;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = generateHmacSignature('GET', apiPath, '', timestamp);

    const apiUrl = buildApiUrl(apiPath);

    maybeEnableInsecureLocalhostTls(apiUrl);

    const headers: Record<string, string> = {
      'X-API-Key': API_KEY,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      'Accept': acceptType,
    };

    console.log('[proxy/consent/download] Outbound request', {
      apiUrl,
      apiPath,
      requirementId,
      bankId,
      fileName,
      acceptType,
    });

    const response = await fetch(apiUrl, { method: 'GET', headers });
    const contentType = response.headers.get('content-type') || '';
    console.log('[proxy/consent/download] Upstream response', {
      status: response.status,
      contentType,
    });

    if (response.status >= 400) {
      let message = `Upstream error ${response.status}`;
      try {
        const errJson = await response.json();
        message = errJson?.message || message;
      } catch {}
      return NextResponse.json({ success: false, message, data: null }, { status: response.status });
    }

    if (contentType.includes('application/json')) {
      const data = await response.json();
      // Normalize success/message keys for consistency
      const success = data.success ?? data.Success;
      const message = data.message ?? data.Message;
      console.log('[proxy/consent/download] JSON payload', { success, message });
      return NextResponse.json(data, { status: response.status });
    }

    // Binary response (e.g., PDF)
    const arrayBuffer = await response.arrayBuffer();
    const headersOut = new Headers();
    headersOut.set('Content-Type', contentType || 'application/pdf');
    const disposition = response.headers.get('content-disposition') || `attachment; filename="${fileName}"`;
    headersOut.set('Content-Disposition', disposition);
    headersOut.set('Cache-Control', 'no-store');
    return new NextResponse(arrayBuffer, { status: response.status, headers: headersOut });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Proxy download failed', data: null },
      { status: 500 }
    );
  }
}
