'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  supplier: string;
  purchase_date: string;
  warranty_expiry: string | null;
  maintenance_schedule: string | null;
  status: string;
}

export default function Inventaris() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: '',
    unit: '',
    location: '',
    supplier: '',
    purchase_date: '',
    warranty_expiry: '',
    maintenance_schedule: '',
    status: 'active'
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchInventory();
  }, [router]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity)
        })
      });
      if (response.ok) {
        setFormData({
          name: '',
          category: '',
          description: '',
          quantity: '',
          unit: '',
          location: '',
          supplier: '',
          purchase_date: '',
          warranty_expiry: '',
          maintenance_schedule: '',
          status: 'active'
        });
        setShowForm(false);
        fetchInventory();
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      quantity: item.quantity.toString(),
      unit: item.unit,
      location: item.location,
      supplier: item.supplier,
      purchase_date: item.purchase_date,
      warranty_expiry: item.warranty_expiry || '',
      maintenance_schedule: item.maintenance_schedule || '',
      status: item.status
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity)
        })
      });
      if (response.ok) {
        setFormData({
          name: '',
          category: '',
          description: '',
          quantity: '',
          unit: '',
          location: '',
          supplier: '',
          purchase_date: '',
          warranty_expiry: '',
          maintenance_schedule: '',
          status: 'active'
        });
        setShowEditModal(false);
        setSelectedItem(null);
        fetchInventory();
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const handleScheduleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !maintenanceSchedule) return;

    try {
      const response = await fetch(`/api/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedItem,
          maintenance_schedule: maintenanceSchedule
        })
      });
      if (response.ok) {
        setShowMaintenanceModal(false);
        setSelectedItem(null);
        setMaintenanceSchedule('');
        fetchInventory();
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      quantity: '',
      unit: '',
      location: '',
      supplier: '',
      purchase_date: '',
      warranty_expiry: '',
      maintenance_schedule: '',
      status: 'active'
    });
    setSelectedItem(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
        fetchInventory();
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const getFilteredInventory = () => {
    switch (filter) {
      case 'active':
        return inventory.filter(item => item.status === 'active');
      case 'maintenance':
        return inventory.filter(item => item.maintenance_schedule);
      case 'warranty':
        return inventory.filter(item => item.warranty_expiry && new Date(item.warranty_expiry) > new Date());
      default:
        return inventory;
    }
  };

  const getWarrantyStatus = (warrantyExpiry: string | null) => {
    if (!warrantyExpiry) return { status: 'no-warranty', color: 'secondary', text: 'No Warranty' };

    const expiry = new Date(warrantyExpiry);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { status: 'expired', color: 'danger', text: 'Expired' };
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'warning', text: `${daysUntilExpiry} days` };
    return { status: 'active', color: 'success', text: 'Active' };
  };

  const getMaintenanceStatus = (schedule: string | null) => {
    if (!schedule) return { status: 'no-maintenance', color: 'secondary', text: 'No Schedule' };
    return { status: 'scheduled', color: 'info', text: schedule };
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

  const filteredInventory = getFilteredInventory();

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Inventaris (Inventory)</h1>
          <div>
            <button className="btn btn-success me-2" onClick={() => { setShowMaintenanceModal(true); setSelectedItem(null); }}>
              Schedule Maintenance
            </button>
            <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
              {showForm ? 'Cancel' : 'Add New Item'}
            </button>
          </div>
        </div>

        {(showForm || showEditModal) && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{showEditModal ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h5>
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
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Supplier</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Purchase Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Warranty Expiry</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.warranty_expiry}
                      onChange={(e) => setFormData({...formData, warranty_expiry: e.target.value})}
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">
                  {showEditModal ? 'Update Item' : 'Add Item'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Maintenance Modal */}
        {showMaintenanceModal && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Schedule Maintenance</h5>
                  <button type="button" className="btn-close" onClick={() => setShowMaintenanceModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Item</label>
                    <select
                      className="form-control"
                      value={selectedItem?.id || ''}
                      onChange={(e) => {
                        const item = inventory.find(i => i.id === parseInt(e.target.value));
                        setSelectedItem(item || null);
                      }}
                      required
                    >
                      <option value="">Select Item</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.location})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Maintenance Schedule</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Monthly, Quarterly, Annually"
                      value={maintenanceSchedule}
                      onChange={(e) => setMaintenanceSchedule(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMaintenanceModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-success" onClick={handleScheduleMaintenance}>
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedItem && (
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Inventory Item Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>ID:</strong> {selectedItem.id}</p>
                      <p><strong>Name:</strong> {selectedItem.name}</p>
                      <p><strong>Category:</strong> {selectedItem.category}</p>
                      <p><strong>Description:</strong> {selectedItem.description}</p>
                      <p><strong>Quantity:</strong> {selectedItem.quantity} {selectedItem.unit}</p>
                      <p><strong>Location:</strong> {selectedItem.location}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Supplier:</strong> {selectedItem.supplier}</p>
                      <p><strong>Purchase Date:</strong> {new Date(selectedItem.purchase_date).toLocaleDateString()}</p>
                      <p><strong>Warranty Expiry:</strong> {selectedItem.warranty_expiry ? new Date(selectedItem.warranty_expiry).toLocaleDateString() : 'No Warranty'}</p>
                      <p><strong>Maintenance Schedule:</strong> {selectedItem.maintenance_schedule || 'No Schedule'}</p>
                      <p><strong>Status:</strong> {selectedItem.status}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => { setShowViewModal(false); handleEdit(selectedItem); }}>
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
                <h5 className="card-title">Total Items</h5>
                <h3>{inventory.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Active Items</h5>
                <h3>{inventory.filter(item => item.status === 'active').length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Under Maintenance</h5>
                <h3>{inventory.filter(item => item.maintenance_schedule).length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Warranty Active</h5>
                <h3>{inventory.filter(item => item.warranty_expiry && new Date(item.warranty_expiry) > new Date()).length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Inventory Filters</h5>
              <div className="btn-group" role="group">
                <input type="radio" className="btn-check" name="filter" id="all" autoComplete="off"
                       checked={filter === 'all'} onChange={() => setFilter('all')} />
                <label className="btn btn-outline-primary" htmlFor="all">All</label>

                <input type="radio" className="btn-check" name="filter" id="active" autoComplete="off"
                       checked={filter === 'active'} onChange={() => setFilter('active')} />
                <label className="btn btn-outline-success" htmlFor="active">Active</label>

                <input type="radio" className="btn-check" name="filter" id="maintenance" autoComplete="off"
                       checked={filter === 'maintenance'} onChange={() => setFilter('maintenance')} />
                <label className="btn btn-outline-warning" htmlFor="maintenance">Maintenance</label>

                <input type="radio" className="btn-check" name="filter" id="warranty" autoComplete="off"
                       checked={filter === 'warranty'} onChange={() => setFilter('warranty')} />
                <label className="btn btn-outline-info" htmlFor="warranty">Warranty</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Inventory Details ({filteredInventory.length} items)</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Purchase Date</th>
                    <th>Warranty</th>
                    <th>Maintenance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const warrantyInfo = getWarrantyStatus(item.warranty_expiry);
                    const maintenanceInfo = getMaintenanceStatus(item.maintenance_schedule);
                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity} {item.unit}</td>
                        <td>{item.location}</td>
                        <td>{new Date(item.purchase_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${warrantyInfo.color}`}>
                            {warrantyInfo.text}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${maintenanceInfo.color}`}>
                            {maintenanceInfo.text}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${item.status === 'active' ? 'success' : 'secondary'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-info me-2" onClick={() => handleView(item)}>
                            View
                          </button>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => { setSelectedItem(item); setShowMaintenanceModal(true); }}
                          >
                            Maintenance
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
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
