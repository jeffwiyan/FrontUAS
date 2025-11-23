'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  patient_id: number;
  doctor_id: number;
}

interface Patient {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
}

export default function JanjiTemu() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    reason: '',
    status: 'scheduled'
  });
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients'),
        fetch('/api/doctors')
      ]);

      const appointmentsData = await appointmentsRes.json();
      const patientsData = await patientsRes.json();
      const doctorsData = await doctorsRes.json();

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ patient_id: '', doctor_id: '', date: '', time: '', reason: '', status: 'scheduled' });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patient_id: appointment.patient_id.toString(),
      doctor_id: appointment.doctor_id.toString(),
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ patient_id: '', doctor_id: '', date: '', time: '', reason: '', status: 'scheduled' });
        setShowEditModal(false);
        setSelectedAppointment(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const resetForm = () => {
    setFormData({ patient_id: '', doctor_id: '', date: '', time: '', reason: '', status: 'scheduled' });
    setSelectedAppointment(null);
  };

  const handleCancel = async (id: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error canceling appointment:', error);
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
          <h1>Janji Temu</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? 'Cancel' : 'Schedule New Appointment'}
          </button>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Appointment' : 'Schedule New Appointment'}</h5>
              <form onSubmit={showEditModal ? handleUpdate : handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Patient</label>
                    <select
                      className="form-control"
                      value={formData.patient_id}
                      onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Doctor</label>
                    <select
                      className="form-control"
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      required
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedAppointment && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Appointment Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {selectedAppointment.id}</p>
                      <p><strong>Patient:</strong> {selectedAppointment.patient_name}</p>
                      <p><strong>Doctor:</strong> {selectedAppointment.doctor_name}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Date:</strong> {selectedAppointment.date}</p>
                      <p><strong>Time:</strong> {selectedAppointment.time}</p>
                      <p><strong>Status:</strong>
                        <span className={`badge ms-2 ${selectedAppointment.status === 'scheduled' ? 'bg-success' : selectedAppointment.status === 'completed' ? 'bg-primary' : 'bg-danger'}`}>
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <strong>Reason:</strong>
                    <p>{selectedAppointment.reason || 'No reason specified'}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedAppointment); }}>
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
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.doctor_name}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span className={`badge ${appointment.status === 'scheduled' ? 'bg-success' : appointment.status === 'completed' ? 'bg-primary' : 'bg-danger'}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleView(appointment)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(appointment)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel
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
