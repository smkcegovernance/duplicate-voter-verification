import { NextRequest } from 'next/server';
import { proxyRequest } from '../../../helper';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiPath = `/api/deposits/commissioner/requirements/${id}/authorize`;
  return proxyRequest(request, apiPath, 'POST');
}