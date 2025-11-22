import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const appointments = db.prepare(`
      SELECT
        a.*,
        p.name as patient_name,
        d.name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
    `).all();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patient_id, doctor_id, date, time, reason, status } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO appointments (patient_id, doctor_id, date, time, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(patient_id, doctor_id, date, time, reason, status || 'scheduled');
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Appointment created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
