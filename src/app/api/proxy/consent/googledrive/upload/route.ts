import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BASE_URL || 'https://localhost:5443/api';

function buildApiUrl(apiPath: string): string {
  const base = (API_BASE_URL || '').replace(/\/+$/g, '');
  let path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  const baseHasApi = /\/api$/i.test(base);
  const pathStartsWithApi = /^\/api\//i.test(path);
  if (baseHasApi && pathStartsWithApi) {
    path = path.replace(/^\/api/i, '');
  }
  return `${base}${path}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Minimal validation to catch obvious client issues before upstream call
    const { requirementId, bankId, fileName, fileData } = body || {};
    if (!requirementId || !bankId || !fileName || !fileData) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: requirementId, bankId, fileName, fileData',
          error: 'NULL_PARAMETER',
        },
        { status: 400 }
      );
    }

    // Compatibility alias: route path keeps /googledrive but forwards to FTP-backed endpoint.
    const apiPath = '/api/deposits/consent/documentconsent';
    const apiUrl = buildApiUrl(apiPath);

    console.log('[proxy/consent/googledrive/upload] Outbound request', { apiUrl });
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const ct = res.headers.get('content-type') || '';
    console.log('[proxy/consent/googledrive/upload] Upstream response', { status: res.status, contentType: ct });

    if (!ct.includes('application/json')) {
      const text = await res.text();
      return NextResponse.json(
        { success: res.ok, message: 'Non-JSON upload response', data: { text } },
        { status: res.status }
      );
    }

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error: any) {
    console.warn('[proxy/consent/googledrive/upload] Error', { message: error?.message });
    return NextResponse.json(
      { success: false, message: error?.message || 'Proxy upload failed', data: null },
      { status: 500 }
    );
  }
}
