import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointment = db.prepare(`
      SELECT
        a.*,
        p.name as patient_name,
        d.name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `).get(id);
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { patient_id, doctor_id, date, time, reason, status } = await request.json();
    const stmt = db.prepare(`
      UPDATE appointments SET patient_id = ?, doctor_id = ?, date = ?, time = ?, reason = ?, status = ?
      WHERE id = ?
    `);
    const result = stmt.run(patient_id, doctor_id, date, time, reason, status, id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
