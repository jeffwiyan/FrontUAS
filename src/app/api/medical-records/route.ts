import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const medicalRecords = db.prepare(`
      SELECT
        mr.*,
        p.name as patient_name,
        d.name as doctor_name
      FROM medical_records mr
      LEFT JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      ORDER BY mr.created_at DESC
    `).all();
    return NextResponse.json(medicalRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patient_id, doctor_id, diagnosis, treatment, date, notes } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment, date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(patient_id, doctor_id, diagnosis, treatment, date, notes);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Medical record created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 });
  }
}
