import { NextRequest } from 'next/server';
import { proxyRequest } from '../helper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'account';
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const status = searchParams.get('status');
  
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (status) params.append('status', status);
  
  const query = params.toString();
  const apiPath = `/api/deposits/${role}/reports${query ? '?' + query : ''}`;
  
  return proxyRequest(request, apiPath, 'GET');
}