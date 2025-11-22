import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(params.id);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, date_of_birth, gender, address, phone, email, medical_history } = await request.json();
    const stmt = db.prepare(`
      UPDATE patients SET name = ?, date_of_birth = ?, gender = ?, address = ?, phone = ?, email = ?, medical_history = ?
      WHERE id = ?
    `);
    const result = stmt.run(name, date_of_birth, gender, address, phone, email, medical_history, params.id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Patient updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(params.id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
