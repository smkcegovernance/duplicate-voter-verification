import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

const API_BASE_URL = process.env.BASE_URL || 'https://localhost:5443/api';
const API_KEY = process.env.API_KEY || 'TEST_API_KEY_12345678901234567890123456789012';
const SECRET_KEY = process.env.SECRET_KEY || 'TEST_SECRET_KEY_67890ABCDEFGHIJ1234567890';

function buildApiUrl(apiPath: string): string {
  const base = (API_BASE_URL || '').replace(/\/+$/g, '');
  const path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  const baseHasApi = /\/api$/i.test(base);
  const pathStartsWithApi = /^\/api\//i.test(path);
  return `${baseHasApi && pathStartsWithApi ? base : `${base}/api`}${pathStartsWithApi ? path.replace(/^\/api/i, '') : path}`;
}

function generateHmacSignature(method: string, uri: string, body: string, timestamp: string): string {
  const stringToSign = method + uri + body + timestamp + API_KEY;
  return CryptoJS.HmacSHA256(stringToSign, SECRET_KEY).toString(CryptoJS.enc.Base64);
}

export async function GET(_req: NextRequest) {
  try {
    const apiPath = '/api/deposits/consent/health';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = generateHmacSignature('GET', apiPath, '', timestamp);
    const apiUrl = buildApiUrl(apiPath);

    const headers: Record<string, string> = {
      'X-API-Key': API_KEY,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      'Accept': 'application/json',
    };

    console.log('[proxy/consent/health] Outbound request', { apiUrl, apiPath });
    const res = await fetch(apiUrl, { method: 'GET', headers });
    const ct = res.headers.get('content-type') || '';
    console.log('[proxy/consent/health] Upstream response', { status: res.status, contentType: ct });

    if (!ct.includes('application/json')) {
      const text = await res.text();
      return NextResponse.json({ success: res.ok, message: 'Non-JSON health response', data: { text } }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error: any) {
    console.warn('[proxy/consent/health] Error', { message: error?.message });
    return NextResponse.json({ success: false, message: error?.message || 'Proxy health failed', data: null }, { status: 500 });
  }
}
