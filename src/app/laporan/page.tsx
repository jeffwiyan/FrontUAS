'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface ReportData {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalPayments: number;
  monthlyRevenue: number;
  activeMedicines: number;
  lowStockItems: number;
  occupiedRooms: number;
}

export default function Laporan() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchReportData();
  }, [router]);

  const fetchReportData = async () => {
    try {
      // Fetch data from multiple endpoints
      const [patientsRes, doctorsRes, appointmentsRes, paymentsRes, medicinesRes, roomsRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/doctors'),
        fetch('/api/appointments'),
        fetch('/api/payments'),
        fetch('/api/medicines'),
        fetch('/api/rooms')
      ]);

      const patients = patientsRes.ok ? await patientsRes.json() : [];
      const doctors = doctorsRes.ok ? await doctorsRes.json() : [];
      const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];
      const payments = paymentsRes.ok ? await paymentsRes.json() : [];
      const medicines = medicinesRes.ok ? await medicinesRes.json() : [];
      const rooms = roomsRes.ok ? await roomsRes.json() : [];

      const data: ReportData = {
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        totalPayments: payments.length,
        monthlyRevenue: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
        activeMedicines: medicines.length,
        lowStockItems: medicines.filter((m: any) => m.stock_quantity <= m.min_stock_level).length,
        occupiedRooms: rooms.filter((r: any) => r.status === 'occupied').length
      };

      setReportData(data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (type: string) => {
    alert(`Generating ${type} report... This would export data to PDF/Excel`);
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Laporan (Reports)</h1>
          <div>
            <button className="btn btn-success me-2" onClick={() => generateReport('PDF')}>
              Export PDF
            </button>
            <button className="btn btn-primary" onClick={() => generateReport('Excel')}>
              Export Excel
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Patients</h5>
                <h3>{reportData?.totalPatients || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Total Doctors</h5>
                <h3>{reportData?.totalDoctors || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Monthly Revenue</h5>
                <h3>${reportData?.monthlyRevenue.toFixed(2) || '0.00'}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Active Medicines</h5>
                <h3>{reportData?.activeMedicines || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Report Types</h5>
              <div className="btn-group" role="group">
                <input type="radio" className="btn-check" name="reportType" id="overview" autoComplete="off"
                       checked={selectedReport === 'overview'} onChange={() => setSelectedReport('overview')} />
                <label className="btn btn-outline-primary" htmlFor="overview">Overview</label>

                <input type="radio" className="btn-check" name="reportType" id="financial" autoComplete="off"
                       checked={selectedReport === 'financial'} onChange={() => setSelectedReport('financial')} />
                <label className="btn btn-outline-success" htmlFor="financial">Financial</label>

                <input type="radio" className="btn-check" name="reportType" id="inventory" autoComplete="off"
                       checked={selectedReport === 'inventory'} onChange={() => setSelectedReport('inventory')} />
                <label className="btn btn-outline-warning" htmlFor="inventory">Inventory</label>

                <input type="radio" className="btn-check" name="reportType" id="patient" autoComplete="off"
                       checked={selectedReport === 'patient'} onChange={() => setSelectedReport('patient')} />
                <label className="btn btn-outline-info" htmlFor="patient">Patient</label>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {selectedReport === 'overview' && (
            <>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5>Hospital Overview</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Patients</span>
                        <strong>{reportData?.totalPatients || 0}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Doctors</span>
                        <strong>{reportData?.totalDoctors || 0}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Appointments</span>
                        <strong>{reportData?.totalAppointments || 0}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Occupied Rooms</span>
                        <strong>{reportData?.occupiedRooms || 0}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5>Financial Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Payments</span>
                        <strong>{reportData?.totalPayments || 0}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Monthly Revenue</span>
                        <strong>${reportData?.monthlyRevenue.toFixed(2) || '0.00'}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Pending Payments</span>
                        <strong>0</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Average Payment</span>
                        <strong>${reportData && reportData.totalPayments > 0 ? (reportData.monthlyRevenue / reportData.totalPayments).toFixed(2) : '0.00'}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedReport === 'financial' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>Financial Report</h5>
                </div>
                <div className="card-body">
                  <p>Detailed financial analytics and payment breakdowns would be displayed here.</p>
                  <p>Features include:</p>
                  <ul>
                    <li>Revenue by payment type</li>
                    <li>Monthly financial trends</li>
                    <li>Outstanding payments</li>
                    <li>Insurance claims status</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'inventory' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>Inventory Report</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Medicine Stock Status</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Active Medicines</span>
                          <strong>{reportData?.activeMedicines || 0}</strong>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Low Stock Items</span>
                          <strong className="text-danger">{reportData?.lowStockItems || 0}</strong>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Expiring Soon</span>
                          <strong className="text-warning">0</strong>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>Equipment Status</h6>
                      <p>Equipment inventory details would be shown here.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'patient' && (
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>Patient Report</h5>
                </div>
                <div className="card-body">
                  <p>Patient statistics and demographics would be displayed here.</p>
                  <p>Features include:</p>
                  <ul>
                    <li>Patient registration trends</li>
                    <li>Demographic breakdown</li>
                    <li>Appointment statistics</li>
                    <li>Patient satisfaction metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
