import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const rooms = db.prepare('SELECT * FROM rooms ORDER BY created_at DESC').all();
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { room_number, type, status } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO rooms (room_number, type, status)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(room_number, type, status || 'available');
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Room created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
