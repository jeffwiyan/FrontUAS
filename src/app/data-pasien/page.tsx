'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface Patient {
  id: number;
  name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  medical_history: string;
}

export default function DataPasien() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    medical_history: ''
  });
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchPatients();
  }, [router]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: '', date_of_birth: '', gender: '', address: '', phone: '', email: '', medical_history: '' });
        setShowForm(false);
        fetchPatients();
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
      medical_history: patient.medical_history
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const response = await fetch(`/api/patients/${selectedPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: '', date_of_birth: '', gender: '', address: '', phone: '', email: '', medical_history: '' });
        setShowEditModal(false);
        setSelectedPatient(null);
        fetchPatients();
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', date_of_birth: '', gender: '', address: '', phone: '', email: '', medical_history: '' });
    setSelectedPatient(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await fetch(`/api/patients/${id}`, { method: 'DELETE' });
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
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
          <h1>Data Pasien</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? 'Cancel' : 'Add New Patient'}
          </button>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Patient' : 'Add New Patient'}</h5>
              <form onSubmit={showEditModal ? handleUpdate : handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-control"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Medical History</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.medical_history || ''}
                      onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Patient' : 'Add Patient'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedPatient && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Patient Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {selectedPatient.id}</p>
                      <p><strong>Name:</strong> {selectedPatient.name}</p>
                      <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
                      <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                      <p><strong>Email:</strong> {selectedPatient.email}</p>
                      <p><strong>Address:</strong> {selectedPatient.address}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <strong>Medical History:</strong>
                    <p>{selectedPatient.medical_history || 'No medical history recorded'}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedPatient); }}>
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
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>
                        <Link href={`/patient-profile/${patient.id}`} className="text-decoration-none">
                          {patient.name}
                        </Link>
                      </td>
                      <td>{patient.date_of_birth}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.email}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleView(patient)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(patient)}>Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(patient.id)}
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
