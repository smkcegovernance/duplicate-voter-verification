import { NextRequest } from 'next/server';
import { proxyRequest } from '../../helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiPath = `/api/deposits/account/banks/${id}`;
  return proxyRequest(request, apiPath, 'GET');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiPath = `/api/deposits/account/banks/${id}`;
  return proxyRequest(request, apiPath, 'PUT');
}