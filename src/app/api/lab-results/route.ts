import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const labResults = db.prepare(`
      SELECT
        lr.*,
        p.name as patient_name
      FROM lab_results lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      ORDER BY lr.created_at DESC
    `).all();
    return NextResponse.json(labResults);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab results' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patient_id, test_name, result, date, notes } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO lab_results (patient_id, test_name, result, date, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    const resultInsert = stmt.run(patient_id, test_name, result, date, notes);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Lab result created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lab result' }, { status: 500 });
  }
}
