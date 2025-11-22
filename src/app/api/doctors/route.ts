import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const doctors = db.prepare('SELECT * FROM doctors ORDER BY created_at DESC').all();
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, specialty, phone, email } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO doctors (name, specialty, phone, email)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, specialty, phone, email);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Doctor created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
