'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Room {
  id: number;
  room_number: string;
  type: string;
  status: string;
}

export default function ManajemenKamar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    room_number: '',
    type: '',
    status: 'available'
  });
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ room_number: '', type: '', status: 'available' });
        setShowForm(false);
        fetchRooms();
      }
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleView = (room: Room) => {
    setSelectedRoom(room);
    setShowViewModal(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      room_number: room.room_number,
      type: room.type,
      status: room.status
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ room_number: '', type: '', status: 'available' });
        setShowEditModal(false);
        setSelectedRoom(null);
        fetchRooms();
      }
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const resetForm = () => {
    setFormData({ room_number: '', type: '', status: 'available' });
    setSelectedRoom(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Manajemen Kamar</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? 'Cancel' : 'Add New Room'}
          </button>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Room' : 'Add New Room'}</h5>
              <form onSubmit={showEditModal ? handleUpdate : handleSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Room Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.room_number}
                      onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="General">General</option>
                      <option value="ICU">ICU</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Maternity">Maternity</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Room' : 'Add Room'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedRoom && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Room Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {selectedRoom.id}</p>
                  <p><strong>Room Number:</strong> {selectedRoom.room_number}</p>
                  <p><strong>Type:</strong> {selectedRoom.type}</p>
                  <p><strong>Status:</strong>
                    <span className={`badge ms-2 ${selectedRoom.status === 'available' ? 'bg-success' : selectedRoom.status === 'occupied' ? 'bg-danger' : 'bg-warning'}`}>
                      {selectedRoom.status}
                    </span>
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedRoom); }}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td>{room.room_number}</td>
                      <td>{room.type}</td>
                      <td>
                        <span className={`badge ${room.status === 'available' ? 'bg-success' : room.status === 'occupied' ? 'bg-danger' : 'bg-warning'}`}>
                          {room.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleView(room)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(room)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(room.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
