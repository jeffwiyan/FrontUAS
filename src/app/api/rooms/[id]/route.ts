import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { room_number, type, status } = await request.json();
    const stmt = db.prepare(`
      UPDATE rooms SET room_number = ?, type = ?, status = ?
      WHERE id = ?
    `);
    const result = stmt.run(room_number, type, status, id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Room updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM rooms WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
