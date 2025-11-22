import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const inventory = db.prepare('SELECT * FROM inventory ORDER BY created_at DESC').all();
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, description, quantity, unit, location, supplier, purchase_date, warranty_expiry, maintenance_schedule, status } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO inventory (name, category, description, quantity, unit, location, supplier, purchase_date, warranty_expiry, maintenance_schedule, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, category, description, quantity, unit, location, supplier, purchase_date, warranty_expiry, maintenance_schedule, status);
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Inventory item created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}
