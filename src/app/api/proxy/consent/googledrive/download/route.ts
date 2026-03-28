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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get('requirementId') || '';
    const bankId = searchParams.get('bankId') || '';
    const fileName = searchParams.get('fileName') || '';

    if (!requirementId || !bankId || !fileName) {
      return NextResponse.json(
        { success: false, message: 'Missing query params', error: 'NULL_PARAMETER', data: null },
        { status: 400 }
      );
    }

    const isPdf = /\.pdf$/i.test(fileName);
    const isJpg = /\.(jpg|jpeg)$/i.test(fileName);
    // Force binary for images; JSON for unknown types
    const acceptType = isPdf ? 'application/pdf' : isJpg ? 'application/octet-stream' : 'application/json';

    const apiQuery = new URLSearchParams();
    apiQuery.append('requirementId', requirementId);
    apiQuery.append('bankId', bankId);
    apiQuery.append('fileName', fileName);

    // Compatibility alias: route path keeps /googledrive but forwards to FTP-backed endpoint.
    const apiPath = `/api/deposits/consent/downloadconsent?${apiQuery.toString()}`;
    const apiUrl = buildApiUrl(apiPath);

    console.log('[proxy/consent/googledrive/download] Outbound request', {
      apiUrl,
      requirementId,
      bankId,
      fileName,
      acceptType,
    });

    const res = await fetch(apiUrl, { method: 'GET', headers: { Accept: acceptType } });
    const contentType = res.headers.get('content-type') || '';
    console.log('[proxy/consent/googledrive/download] Upstream response', {
      status: res.status,
      contentType,
    });

    if (res.status >= 400) {
      let message = `Upstream error ${res.status}`;
      try {
        const errJson = await res.json();
        message = errJson?.message || message;
        return NextResponse.json(errJson, { status: res.status });
      } catch {
        const text = await res.text();
        return NextResponse.json({ success: false, message, data: { text } }, { status: res.status });
      }
    }

    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const arrayBuffer = await res.arrayBuffer();
    const headersOut = new Headers();
    headersOut.set('Content-Type', contentType || (isPdf ? 'application/pdf' : 'application/octet-stream'));
    const disposition = res.headers.get('content-disposition') || `attachment; filename="${fileName}"`;
    headersOut.set('Content-Disposition', disposition);
    headersOut.set('Cache-Control', 'no-store');
    return new NextResponse(arrayBuffer, { status: res.status, headers: headersOut });
  } catch (error: any) {
    console.warn('[proxy/consent/googledrive/download] Error', { message: error?.message });
    return NextResponse.json(
      { success: false, message: error?.message || 'Proxy download failed', data: null },
      { status: 500 }
    );
  }
}
