import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const payments = db.prepare(`
      SELECT p.*, pt.name as patient_name
      FROM payments p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      ORDER BY p.created_at DESC
    `).all();
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patient_id, amount, payment_type, description, payment_date, status } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO payments (patient_id, amount, payment_type, description, payment_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(patient_id, amount, payment_type, description, payment_date, status);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Payment created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
