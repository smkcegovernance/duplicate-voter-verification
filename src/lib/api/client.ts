'use client';

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown
): Promise<T> {
  console.log(`[API Client] ${method} ${path}`, body ? { body } : '');
  
  const bodyStr = body ? JSON.stringify(body) : '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  console.log('[API Client] Fetch options:', { method, path, headers, hasBody: !!bodyStr });
  
  const res = await fetch(path, {
    method,
    headers,
    body: bodyStr || undefined,
    cache: 'no-store',
  });
  
  console.log(`[API Client] Response status: ${res.status} ${res.statusText}`);
  console.log('[API Client] Full response object:', res);
  console.log('[API Client] Response headers:', Object.fromEntries(res.headers.entries()));
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`[API Client] Error response:`, text);
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }
  
  const json = await res.json();
  console.log(`[API Client] Response data:`, json);
  console.log('[API Client] Response data (stringified):', JSON.stringify(json, null, 2));
  
  // Handle .NET ApiResponse wrapper structure
  if (json && typeof json === 'object') {
    console.log('[API Client] Checking for .NET ApiResponse structure...');
    
    // Check if it's wrapped in ApiResponse with Success/Data pattern
    if ('success' in json || 'Success' in json) {
      const success = json.success ?? json.Success;
      console.log('[API Client] .NET ApiResponse detected, Success:', success);
      
      if (!success) {
        const message = json.message ?? json.Message ?? 'API request failed';
        const errorCode = json.errorCode ?? json.ErrorCode ?? 'UNKNOWN_ERROR';
        console.error('[API Client] .NET API returned failure:', { message, errorCode });
        throw new Error(`${message} (${errorCode})`);
      }
      
      // Extract the actual data from Data property
      const data = json.data ?? json.Data;
      console.log('[API Client] Extracted data from .NET ApiResponse:', data);
      return data as T;
    }
  }
  
  return json as T;
}

export const api = {
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
};