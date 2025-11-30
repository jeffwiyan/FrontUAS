'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Stats {
  patients: number;
  doctors: number;
  appointments: number;
  rooms: number;
  payments: number;
  medicines: number;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ patients: 0, doctors: 0, appointments: 0, rooms: 0, payments: 0, medicines: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes, roomsRes, paymentsRes, medicinesRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/doctors'),
          fetch('/api/appointments'),
          fetch('/api/rooms'),
          fetch('/api/payments'),
          fetch('/api/medicines'),
        ]);

        const patients = patientsRes.ok ? await patientsRes.json() : [];
        const doctors = doctorsRes.ok ? await doctorsRes.json() : [];
        const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];
        const rooms = roomsRes.ok ? await roomsRes.json() : [];
        const payments = paymentsRes.ok ? await paymentsRes.json() : [];
        const medicines = medicinesRes.ok ? await medicinesRes.json() : [];

        setStats({
          patients: Array.isArray(patients) ? patients.length : 0,
          doctors: Array.isArray(doctors) ? doctors.length : 0,
          appointments: Array.isArray(appointments) ? appointments.length : 0,
          rooms: Array.isArray(rooms) ? rooms.length : 0,
          payments: Array.isArray(payments) ? payments.length : 0,
          medicines: Array.isArray(medicines) ? medicines.length : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    // Mock recent activities - in a real app, this would come from the database
    const mockActivities: Activity[] = [
      { id: 1, action: 'Patient Registered', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), details: 'New patient John Doe registered' },
      { id: 2, action: 'Appointment Scheduled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), details: 'Appointment scheduled for Jane Smith with Dr. Johnson' },
      { id: 3, action: 'Payment Received', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), details: 'Payment of $150.00 received from patient' },
      { id: 4, action: 'Medicine Stock Updated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), details: 'Stock updated for Paracetamol' },
      { id: 5, action: 'Lab Result Added', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), details: 'New lab result added for patient examination' },
    ];
    setActivities(mockActivities);

    fetchStats();
  }, [router]);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h1 className="mb-4">Dashboard</h1>

        <div className="row">
          <div className="col-md-2 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Patients</h5>
                <h2>{stats.patients}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Doctors</h5>
                <h2>{stats.doctors}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Appointments</h5>
                <h2>{stats.appointments}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Rooms</h5>
                <h2>{stats.rooms}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div className="card bg-secondary text-white">
              <div className="card-body">
                <h5 className="card-title">Payments</h5>
                <h2>{stats.payments}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h5 className="card-title">Medicines</h5>
                <h2>{stats.medicines}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>Recent Activity</h5>
              </div>
              <div className="card-body">
                <div className="list-group">
                  {activities.map((activity) => (
                    <div key={activity.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{activity.action}</h6>
                        <small className="text-muted">
                          {new Date(activity.timestamp).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-1">{activity.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" onClick={() => router.push('/data-pasien')}>
                    Add Patient
                  </button>
                  <button className="btn btn-success" onClick={() => router.push('/janji-temu')}>
                    Schedule Appointment
                  </button>
                  <button className="btn btn-info" onClick={() => router.push('/laporan')}>
                    View Reports
                  </button>
                  <button className="btn btn-warning" onClick={() => router.push('/pembayaran')}>
                    Record Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
