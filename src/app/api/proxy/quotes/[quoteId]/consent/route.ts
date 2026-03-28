import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Legacy quote consent download removed. Use /api/proxy/consent/download.' },
    { status: 410 }
  );
}
