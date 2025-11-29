'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface LabResult {
  id: number;
  patient_name: string;
  test_name: string;
  result: string;
  date: string;
  notes: string;
}

export default function Laboratorium() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [formData, setFormData] = useState({
    patient_name: '',
    test_name: '',
    result: '',
    date: '',
    notes: ''
  });
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchLabResults();
  }, [router]);

  const fetchLabResults = async () => {
    try {
      const response = await fetch('/api/lab-results');
      const data = await response.json();
      setLabResults(data);
    } catch (error) {
      console.error('Error fetching lab results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/lab-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ patient_name: '', test_name: '', result: '', date: '', notes: '' });
        setShowForm(false);
        fetchLabResults();
      }
    } catch (error) {
      console.error('Error adding lab result:', error);
    }
  };

  const handleView = (result: LabResult) => {
    setSelectedResult(result);
    setShowViewModal(true);
  };

  const handleEdit = (result: LabResult) => {
    setSelectedResult(result);
    setFormData({
      patient_name: result.patient_name,
      test_name: result.test_name,
      result: result.result,
      date: result.date,
      notes: result.notes
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResult) return;

    try {
      const response = await fetch(`/api/lab-results/${selectedResult.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ patient_name: '', test_name: '', result: '', date: '', notes: '' });
        setShowEditModal(false);
        setSelectedResult(null);
        fetchLabResults();
      }
    } catch (error) {
      console.error('Error updating lab result:', error);
    }
  };

  const resetForm = () => {
    setFormData({ patient_name: '', test_name: '', result: '', date: '', notes: '' });
    setSelectedResult(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this lab result?')) {
      try {
        await fetch(`/api/lab-results/${id}`, { method: 'DELETE' });
        fetchLabResults();
      } catch (error) {
        console.error('Error deleting lab result:', error);
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
          <h1>Laboratorium (Laboratory)</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? 'Cancel' : 'Add New Test Result'}
          </button>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Lab Result' : 'Add New Lab Result'}</h5>
              <form onSubmit={showEditModal ? handleUpdate : handleSubmit}>
                <div className="row">
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
                    <label className="form-label">Test Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.test_name}
                      onChange={(e) => setFormData({...formData, test_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Result</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.result}
                      onChange={(e) => setFormData({...formData, result: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Result' : 'Add Result'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedResult && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Lab Result Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {selectedResult.id}</p>
                      <p><strong>Patient Name:</strong> {selectedResult.patient_name}</p>
                      <p><strong>Test Name:</strong> {selectedResult.test_name}</p>
                      <p><strong>Result:</strong> {selectedResult.result}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Date:</strong> {new Date(selectedResult.date).toLocaleDateString()}</p>
                      <p><strong>Notes:</strong> {selectedResult.notes || 'No notes'}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedResult); }}>
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
                    <th>Test Name</th>
                    <th>Result</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((result) => (
                    <tr key={result.id}>
                      <td>{result.id}</td>
                      <td>{result.patient_name}</td>
                      <td>{result.test_name}</td>
                      <td>{result.result}</td>
                      <td>{new Date(result.date).toLocaleDateString()}</td>
                      <td>{result.notes}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleView(result)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(result)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(result.id)}
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
