
// Placeholder auth route for testing
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ providers: [] });
}
