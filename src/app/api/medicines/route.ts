import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const medicines = db.prepare('SELECT * FROM medicines ORDER BY created_at DESC').all();
    return NextResponse.json(medicines);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, generic_name, category, dosage_form, strength, manufacturer, expiry_date, stock_quantity, unit_price, min_stock_level } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO medicines (name, generic_name, category, dosage_form, strength, manufacturer, expiry_date, stock_quantity, unit_price, min_stock_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, generic_name, category, dosage_form, strength, manufacturer, expiry_date, stock_quantity, unit_price, min_stock_level);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Medicine created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medicine' }, { status: 500 });
  }
}
