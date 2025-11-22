import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const patients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC').all();
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, date_of_birth, gender, address, phone, email, medical_history } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO patients (name, date_of_birth, gender, address, phone, email, medical_history)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, date_of_birth, gender, address, phone, email, medical_history);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Patient created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
