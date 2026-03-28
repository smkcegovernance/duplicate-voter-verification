import { buildAuthHeaders } from '@/lib/hmac';
import { maybeEnableInsecureLocalhostTls } from '@/lib/tls';

function getBaseUrl() {
  return process.env.BASE_URL || '';
}

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown
): Promise<T> {
  const url = new URL(path, getBaseUrl());
  const pathWithQuery = url.pathname + (url.search || '');
  const bodyStr = body ? JSON.stringify(body) : '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...buildAuthHeaders(method, pathWithQuery, bodyStr),
  };
  console.log(`[API Server] ${method} ${url.toString()}`);
  
  // Disable SSL certificate validation for localhost HTTPS requests
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: bodyStr || undefined,
    cache: 'no-store',
    next: { revalidate: 0 },
  };
  
  maybeEnableInsecureLocalhostTls(url.toString());
  
  const res = await fetch(url.toString(), fetchOptions);
  
  console.log(`[API Server] Response status: ${res.status}`);
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`[API Server] Error response:`, text);
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }
  
  const json = await res.json();
  console.log('[API Server] Response JSON:', json);
  
  // Handle .NET ApiResponse wrapper structure
  if (json && typeof json === 'object') {
    // Check if it's wrapped in ApiResponse with Success/Data pattern
    if ('success' in json || 'Success' in json) {
      const success = json.success ?? json.Success;
      console.log('[API Server] .NET ApiResponse detected, Success:', success);
      
      if (!success) {
        const message = json.message ?? json.Message ?? 'API request failed';
        const errorCode = json.errorCode ?? json.ErrorCode ?? 'UNKNOWN_ERROR';
        console.error('[API Server] .NET API returned failure:', { message, errorCode });
        throw new Error(`${message} (${errorCode})`);
      }
      
      // Extract the actual data from Data property
      const data = json.data ?? json.Data;
      console.log('[API Server] Extracted data from .NET ApiResponse:', data);
      return data as T;
    }
  }
  
  return json as T;
}

export const apiServer = {
  findDuplicates: (payload: { firstName: string; middleName?: string; lastName: string }) =>
    request<any>('POST', '/api/voters/find-duplicates', payload),
  verificationStatus: () => request<any>('GET', '/api/voters/verification-status'),
  duplicateGroups: (duplicationId?: number) =>
    request<any>('GET', duplicationId ? `/api/voters/duplicate-groups?duplicationId=${duplicationId}` : '/api/voters/duplicate-groups'),
  voterBySrNo: (srNo: number) => request<any>('GET', `/api/voters/${srNo}`),
  unverifiedCount: () => request<any>('GET', '/api/voters/unverified-count'),
  markDuplicates: (payload: { srNoArray: number[]; isDuplicate: boolean; remarks?: string }) =>
    request<any>('POST', '/api/voters/mark-duplicates', payload),
  resetVerification: () => request<any>('POST', '/api/voters/reset-verification'),
  voterReport: (payload: any) => request<any>('POST', '/api/voters/report', payload),
};
