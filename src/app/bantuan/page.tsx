'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function Bantuan() {
  const [showModal, setShowModal] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleClose = () => {
    setShowModal(false);
    router.back(); // Go back to previous page
  };

  if (!showModal) {
    return null;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        {/* Modal Backdrop */}
        <div
          className="modal-backdrop show"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040
          }}
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div
          className="modal show d-block"
          style={{ zIndex: 1050 }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bantuan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h5>Help & Support</h5>
                <p>Welcome to the Hospital Management System help center.</p>

                <h6>Getting Started</h6>
                <ul>
                  <li>Login with your credentials</li>
                  <li>Navigate using the sidebar menu</li>
                  <li>Access different modules based on your permissions</li>
                </ul>

                <h6>Common Tasks</h6>
                <ul>
                  <li><strong>Patient Management:</strong> Add, view, and update patient information</li>
                  <li><strong>Appointments:</strong> Schedule and manage patient appointments</li>
                  <li><strong>Medical Records:</strong> View and update patient medical history</li>
                  <li><strong>Reports:</strong> Generate various hospital reports</li>
                </ul>

                <h6>Contact Support</h6>
                <p>If you need additional help, please contact the system administrator.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
