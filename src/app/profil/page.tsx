'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

export default function Profil() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
    fetchActivities();
  }, [router]);

  const fetchUserProfile = async () => {
    setUser({
      id: 1,
      username: 'admin',
      role: 'Administrator',
      created_at: '2024-01-01T00:00:00.000Z'
    });
  };

  const fetchActivities = async () => {
    const mockActivities: Activity[] = [
      { id: 1, action: 'Login', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), details: 'User logged into the system' },
      { id: 2, action: 'Patient Added', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), details: 'Added new patient: John Doe' },
      { id: 3, action: 'Appointment Scheduled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), details: 'Scheduled appointment for Jane Smith' },
      { id: 4, action: 'Payment Recorded', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), details: 'Recorded payment of $150.00' },
      { id: 5, action: 'Medicine Updated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), details: 'Updated stock for Paracetamol' },
    ];
    setActivities(mockActivities);
    setLoading(false);
  };

  const handlePasswordChange = () => {
    alert('Password change functionality would be implemented here');
  };

  const handlePreferencesUpdate = () => {
    alert('Preferences update functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h1>Profil (Profile)</h1>

        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Profile Information</h5>
              </div>
              <div className="card-body">
                {user && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input type="text" className="form-control" value={user.username} readOnly />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <input type="text" className="form-control" value={user.role} readOnly />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Member Since</label>
                      <input type="text" className="form-control" value={new Date(user.created_at).toLocaleDateString()} readOnly />
                    </div>
                    <button className="btn btn-primary me-2" onClick={handlePasswordChange}>
                      Change Password
                    </button>
                    <button className="btn btn-secondary" onClick={handlePreferencesUpdate}>
                      Update Preferences
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
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
        </div>
      </div>
    </div>
  );
}
