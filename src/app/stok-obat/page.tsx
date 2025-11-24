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

export default function StokObat() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');
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

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine || !restockQuantity) return;

    try {
      const newQuantity = selectedMedicine.stock_quantity + parseInt(restockQuantity);
      const response = await fetch(`/api/medicines/${selectedMedicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedMedicine,
          stock_quantity: newQuantity
        })
      });
      if (response.ok) {
        setShowRestockModal(false);
        setSelectedMedicine(null);
        setRestockQuantity('');
        fetchMedicines();
      }
    } catch (error) {
      console.error('Error restocking medicine:', error);
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

  const getFilteredMedicines = () => {
    switch (filter) {
      case 'low':
        return medicines.filter(m => m.stock_quantity <= m.min_stock_level);
      case 'expiring':
        return medicines.filter(m => new Date(m.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
      case 'expired':
        return medicines.filter(m => new Date(m.expiry_date) < new Date());
      default:
        return medicines;
    }
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity <= minLevel) return 'danger';
    if (quantity <= minLevel * 1.5) return 'warning';
    return 'success';
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { status: 'expired', color: 'danger', text: 'Expired' };
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'warning', text: `${daysUntilExpiry} days` };
    if (daysUntilExpiry <= 90) return { status: 'soon', color: 'info', text: `${daysUntilExpiry} days` };
    return { status: 'good', color: 'success', text: 'Good' };
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

  const filteredMedicines = getFilteredMedicines();

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Stok Obat (Medicine Stock)</h1>
          <div>
            <button className="btn btn-success me-2" onClick={() => { setShowRestockModal(true); setSelectedMedicine(null); }}>
              Restock Medicine
            </button>
            <button className="btn btn-primary" onClick={() => { setShowEditModal(true); setSelectedMedicine(null); setFormData({
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
            }); }}>
              Add New Medicine
            </button>
          </div>
        </div>

        {/* Restock Modal */}
        {showRestockModal && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Restock Medicine</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRestockModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Medicine</label>
                    <select
                      className="form-control"
                      value={selectedMedicine?.id || ''}
                      onChange={(e) => {
                        const medicine = medicines.find(m => m.id === parseInt(e.target.value));
                        setSelectedMedicine(medicine || null);
                      }}
                      required
                    >
                      <option value="">Select Medicine</option>
                      {medicines.map(medicine => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.name} (Current: {medicine.stock_quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Restock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={restockQuantity}
                      onChange={(e) => setRestockQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRestockModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success" onClick={handleRestock}>
                    Restock
                  </button>
                </div>
              </div>
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

        {/* Edit/Add Modal */}
        {showEditModal && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdate}>
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
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success">
                        {selectedMedicine ? 'Update Medicine' : 'Add Medicine'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Items</h5>
                <h3>{medicines.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <h5 className="card-title">Low Stock</h5>
                <h3>{medicines.filter(m => m.stock_quantity <= m.min_stock_level).length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Expiring Soon</h5>
                <h3>{medicines.filter(m => {
                  const expiry = new Date(m.expiry_date);
                  const now = new Date();
                  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                  return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                }).length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-secondary text-white">
              <div className="card-body">
                <h5 className="card-title">Expired</h5>
                <h3>{medicines.filter(m => new Date(m.expiry_date) < new Date()).length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Stock Filters</h5>
              <div className="btn-group" role="group">
                <input type="radio" className="btn-check" name="filter" id="all" autoComplete="off"
                       checked={filter === 'all'} onChange={() => setFilter('all')} />
                <label className="btn btn-outline-primary" htmlFor="all">All</label>

                <input type="radio" className="btn-check" name="filter" id="low" autoComplete="off"
                       checked={filter === 'low'} onChange={() => setFilter('low')} />
                <label className="btn btn-outline-danger" htmlFor="low">Low Stock</label>

                <input type="radio" className="btn-check" name="filter" id="expiring" autoComplete="off"
                       checked={filter === 'expiring'} onChange={() => setFilter('expiring')} />
                <label className="btn btn-outline-warning" htmlFor="expiring">Expiring Soon</label>

                <input type="radio" className="btn-check" name="filter" id="expired" autoComplete="off"
                       checked={filter === 'expired'} onChange={() => setFilter('expired')} />
                <label className="btn btn-outline-secondary" htmlFor="expired">Expired</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Medicine Stock Details ({filteredMedicines.length} items)</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Generic Name</th>
                    <th>Current Stock</th>
                    <th>Min Level</th>
                    <th>Unit Price</th>
                    <th>Expiry Date</th>
                    <th>Stock Status</th>
                    <th>Expiry Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => {
                    const expiryInfo = getExpiryStatus(medicine.expiry_date);
                    return (
                      <tr key={medicine.id}>
                        <td>{medicine.name}</td>
                        <td>{medicine.generic_name}</td>
                        <td>
                          <span className={`badge bg-${getStockStatus(medicine.stock_quantity, medicine.min_stock_level)}`}>
                            {medicine.stock_quantity}
                          </span>
                        </td>
                        <td>{medicine.min_stock_level}</td>
                        <td>${medicine.unit_price.toFixed(2)}</td>
                        <td>{new Date(medicine.expiry_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${getStockStatus(medicine.stock_quantity, medicine.min_stock_level)}`}>
                            {medicine.stock_quantity <= medicine.min_stock_level ? 'Low Stock' :
                             medicine.stock_quantity <= medicine.min_stock_level * 1.5 ? 'Medium Stock' : 'Good Stock'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${expiryInfo.color}`}>
                            {expiryInfo.text}
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
                            className="btn btn-sm btn-success me-2"
                            onClick={() => { setSelectedMedicine(medicine); setShowRestockModal(true); }}
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
