'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Medicine {
  id: number;
  name: string;
  generic_name: string;
  category: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  expiry_date: string;
  stock_quantity: number;
  unit_price: number;
  min_stock_level: number;
}

export default function Apotek() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    dosage_form: '',
    strength: '',
    manufacturer: '',
    expiry_date: '',
    stock_quantity: '',
    unit_price: '',
    min_stock_level: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchMedicines();
  }, [router]);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/medicines');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock_quantity: parseInt(formData.stock_quantity),
          unit_price: parseFloat(formData.unit_price),
          min_stock_level: parseInt(formData.min_stock_level)
        })
      });
      if (response.ok) {
        setFormData({
          name: '',
          generic_name: '',
          category: '',
          dosage_form: '',
          strength: '',
          manufacturer: '',
          expiry_date: '',
          stock_quantity: '',
          unit_price: '',
          min_stock_level: ''
        });
        setShowForm(false);
        fetchMedicines();
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const handleView = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowViewModal(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      name: medicine.name,
      generic_name: medicine.generic_name,
      category: medicine.category,
      dosage_form: medicine.dosage_form,
      strength: medicine.strength,
      manufacturer: medicine.manufacturer,
      expiry_date: medicine.expiry_date,
      stock_quantity: medicine.stock_quantity.toString(),
      unit_price: medicine.unit_price.toString(),
      min_stock_level: medicine.min_stock_level.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    try {
      const response = await fetch(`/api/medicines/${selectedMedicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock_quantity: parseInt(formData.stock_quantity),
          unit_price: parseFloat(formData.unit_price),
          min_stock_level: parseInt(formData.min_stock_level)
        })
      });
      if (response.ok) {
        setFormData({
          name: '',
          generic_name: '',
          category: '',
          dosage_form: '',
          strength: '',
          manufacturer: '',
          expiry_date: '',
          stock_quantity: '',
          unit_price: '',
          min_stock_level: ''
        });
        setShowEditModal(false);
        setSelectedMedicine(null);
        fetchMedicines();
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      generic_name: '',
      category: '',
      dosage_form: '',
      strength: '',
      manufacturer: '',
      expiry_date: '',
      stock_quantity: '',
      unit_price: '',
      min_stock_level: ''
    });
    setSelectedMedicine(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= minLevel) return 'danger';
    if (quantity <= minLevel * 1.5) return 'warning';
    return 'success';
  };

  const getStockStatusText = (quantity: number, minLevel: number) => {
    if (quantity <= minLevel) return 'Low Stock';
    if (quantity <= minLevel * 1.5) return 'Medium Stock';
    return 'Good Stock';
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
          <h1>Apotek (Pharmacy)</h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
            {showForm ? 'Cancel' : 'Add New Medicine'}
          </button>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Medicine' : 'Add New Medicine'}</h5>
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
                    <label className="form-label">Generic Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.generic_name}
                      onChange={(e) => setFormData({...formData, generic_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Dosage Form</label>
                    <select
                      className="form-control"
                      value={formData.dosage_form}
                      onChange={(e) => setFormData({...formData, dosage_form: e.target.value})}
                      required
                    >
                      <option value="">Select Dosage Form</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Strength</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.strength}
                      onChange={(e) => setFormData({...formData, strength: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Manufacturer</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.unit_price}
                      onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Min Stock Level</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.min_stock_level}
                      onChange={(e) => setFormData({...formData, min_stock_level: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Medicine' : 'Add Medicine'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedMedicine && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Medicine Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {selectedMedicine.id}</p>
                      <p><strong>Name:</strong> {selectedMedicine.name}</p>
                      <p><strong>Generic Name:</strong> {selectedMedicine.generic_name}</p>
                      <p><strong>Category:</strong> {selectedMedicine.category}</p>
                      <p><strong>Dosage Form:</strong> {selectedMedicine.dosage_form}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Strength:</strong> {selectedMedicine.strength}</p>
                      <p><strong>Manufacturer:</strong> {selectedMedicine.manufacturer}</p>
                      <p><strong>Expiry Date:</strong> {new Date(selectedMedicine.expiry_date).toLocaleDateString()}</p>
                      <p><strong>Stock Quantity:</strong> {selectedMedicine.stock_quantity}</p>
                      <p><strong>Unit Price:</strong> ${selectedMedicine.unit_price.toFixed(2)}</p>
                      <p><strong>Min Stock Level:</strong> {selectedMedicine.min_stock_level}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedMedicine); }}>
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
                <h5 className="card-title">Total Medicines</h5>
                <h3>{medicines.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Low Stock Items</h5>
                <h3>{medicines.filter(m => m.stock_quantity <= m.min_stock_level).length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Expiring Soon</h5>
                <h3>{medicines.filter(m => new Date(m.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Total Stock Value</h5>
                <h3>${medicines.reduce((sum, m) => sum + (m.stock_quantity * m.unit_price), 0).toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Medicine Inventory</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Generic Name</th>
                    <th>Category</th>
                    <th>Dosage Form</th>
                    <th>Strength</th>
                    <th>Stock</th>
                    <th>Unit Price</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>{medicine.name}</td>
                      <td>{medicine.generic_name}</td>
                      <td>{medicine.category}</td>
                      <td>{medicine.dosage_form}</td>
                      <td>{medicine.strength}</td>
                      <td>
                        <span className={`badge bg-${getStockStatus(medicine.stock_quantity, medicine.min_stock_level)}`}>
                          {medicine.stock_quantity}
                        </span>
                      </td>
                      <td>${medicine.unit_price.toFixed(2)}</td>
                      <td>{new Date(medicine.expiry_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${getStockStatus(medicine.stock_quantity, medicine.min_stock_level)}`}>
                          {getStockStatusText(medicine.stock_quantity, medicine.min_stock_level)}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleView(medicine)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(medicine)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(medicine.id)}
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
