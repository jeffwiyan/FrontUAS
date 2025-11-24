'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Payment {
  id: number;
  patient_id: number;
  patient_name: string;
  amount: number;
  payment_type: string;
  description: string;
  payment_date: string;
  status: string;
}

export default function Pembayaran() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    amount: '',
    payment_type: 'Cash',
    description: '',
    payment_date: '',
    status: 'pending'
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchPayments();
  }, [router]);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patient_id: parseInt(formData.patient_id),
          amount: parseFloat(formData.amount)
        })
      });
      if (response.ok) {
        setFormData({
          patient_id: '',
          patient_name: '',
          amount: '',
          payment_type: 'Cash',
          description: '',
          payment_date: '',
          status: 'pending'
        });
        setShowForm(false);
        fetchPayments();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      patient_id: payment.patient_id.toString(),
      patient_name: payment.patient_name,
      amount: payment.amount.toString(),
      payment_type: payment.payment_type,
      description: payment.description,
      payment_date: payment.payment_date,
      status: payment.status
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/payments/${selectedPayment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patient_id: parseInt(formData.patient_id),
          amount: parseFloat(formData.amount)
        })
      });
      if (response.ok) {
        setFormData({
          patient_id: '',
          patient_name: '',
          amount: '',
          payment_type: 'Cash',
          description: '',
          payment_date: '',
          status: 'pending'
        });
        setShowEditModal(false);
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleMarkPaid = async (payment: Payment) => {
    try {
      const response = await fetch(`/api/payments/${payment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payment,
          status: 'completed'
        })
      });
      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      patient_name: '',
      amount: '',
      payment_type: 'Cash',
      description: '',
      payment_date: '',
      status: 'pending'
    });
    setSelectedPayment(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      try {
        await fetch(`/api/payments/${id}`, { method: 'DELETE' });
        fetchPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const getFilteredPayments = () => {
    switch (filter) {
      case 'pending':
        return payments.filter(p => p.status === 'pending');
      case 'completed':
        return payments.filter(p => p.status === 'completed');
      case 'cash':
        return payments.filter(p => p.payment_type === 'Cash');
      case 'card':
        return payments.filter(p => p.payment_type === 'Card');
      default:
        return payments;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case 'Cash':
        return 'primary';
      case 'Card':
        return 'info';
      case 'Insurance':
        return 'success';
      default:
        return 'secondary';
    }
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

  const filteredPayments = getFilteredPayments();
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Pembayaran (Payments)</h1>
          <div>
            <button className="btn btn-success me-2" onClick={() => { setShowForm(!showForm); resetForm(); }}>
              {showForm ? 'Cancel' : 'Record Payment'}
            </button>
            <button className="btn btn-primary">Generate Bill</button>
          </div>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Payment' : 'Record New Payment'}</h5>
              <form onSubmit={showEditModal ? handleUpdate : handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Patient ID</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.patient_id}
                      onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Patient Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.patient_name}
                      onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Type</label>
                    <select
                      className="form-control"
                      value={formData.payment_type}
                      onChange={(e) => setFormData({...formData, payment_type: e.target.value})}
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.payment_date}
                      onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Payment' : 'Record Payment'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedPayment && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Payment Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {selectedPayment.id}</p>
                      <p><strong>Patient ID:</strong> {selectedPayment.patient_id}</p>
                      <p><strong>Patient Name:</strong> {selectedPayment.patient_name}</p>
                      <p><strong>Amount:</strong> ${selectedPayment.amount.toFixed(2)}</p>
                      <p><strong>Payment Type:</strong> {selectedPayment.payment_type}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Payment Date:</strong> {new Date(selectedPayment.payment_date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {selectedPayment.status}</p>
                      <p><strong>Description:</strong> {selectedPayment.description || 'No description'}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedPayment); }}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Payments</h5>
                <h3>{payments.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Completed</h5>
                <h3>{completedPayments}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Pending</h5>
                <h3>{pendingPayments}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Total Amount</h5>
                <h3>${totalAmount.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Payment Filters</h5>
              <div className="btn-group" role="group">
                <input type="radio" className="btn-check" name="filter" id="all" autoComplete="off"
                       checked={filter === 'all'} onChange={() => setFilter('all')} />
                <label className="btn btn-outline-primary" htmlFor="all">All</label>

                <input type="radio" className="btn-check" name="filter" id="pending" autoComplete="off"
                       checked={filter === 'pending'} onChange={() => setFilter('pending')} />
                <label className="btn btn-outline-warning" htmlFor="pending">Pending</label>

                <input type="radio" className="btn-check" name="filter" id="completed" autoComplete="off"
                       checked={filter === 'completed'} onChange={() => setFilter('completed')} />
                <label className="btn btn-outline-success" htmlFor="completed">Completed</label>

                <input type="radio" className="btn-check" name="filter" id="cash" autoComplete="off"
                       checked={filter === 'cash'} onChange={() => setFilter('cash')} />
                <label className="btn btn-outline-primary" htmlFor="cash">Cash</label>

                <input type="radio" className="btn-check" name="filter" id="card" autoComplete="off"
                       checked={filter === 'card'} onChange={() => setFilter('card')} />
                <label className="btn btn-outline-info" htmlFor="card">Card</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Payment Records ({filteredPayments.length} payments)</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Amount</th>
                    <th>Payment Type</th>
                    <th>Description</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.patient_name}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${getPaymentTypeBadge(payment.payment_type)}`}>
                          {payment.payment_type}
                        </span>
                      </td>
                      <td>{payment.description}</td>
                      <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        {payment.status === 'pending' && (
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleMarkPaid(payment)}>
                            Mark Paid
                          </button>
                        )}
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleView(payment)}>
                          View Details
                        </button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(payment)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(payment.id)}
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
