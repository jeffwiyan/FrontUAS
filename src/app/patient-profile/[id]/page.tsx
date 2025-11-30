'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface Patient {
  id: number;
  name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  medical_history: string;
}

interface MedicalRecord {
  id: number;
  diagnosis: string;
  treatment: string;
  date: string;
  doctor_name: string;
}

export default function PatientProfile() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (params.id) {
      fetchPatientData();
    }
  }, [params.id, router]);

  const fetchPatientData = async () => {
    try {
      const [patientRes, recordsRes] = await Promise.all([
        fetch(`/api/patients/${params.id}`),
        fetch('/api/medical-records'),
      ]);

      const patientData = await patientRes.json();
      const allRecords = await recordsRes.json();

      setPatient(patientData);
      // Filter records for this patient
      setMedicalRecords(allRecords.filter((record: any) => record.patient_id === parseInt(params.id as string)));
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
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

  if (!patient) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <div className="alert alert-danger">Patient not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Patient Profile: {patient.name}</h1>
          <button className="btn btn-secondary" onClick={() => router.back()}>
            Back
          </button>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Personal Information</h5>
              </div>
              <div className="card-body">
                <p><strong>ID:</strong> {patient.id}</p>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Address:</strong> {patient.address}</p>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Medical History</h5>
              </div>
              <div className="card-body">
                <p>{patient.medical_history || 'No medical history recorded.'}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5>Medical Records</h5>
              </div>
              <div className="card-body">
                {medicalRecords.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Doctor</th>
                          <th>Diagnosis</th>
                          <th>Treatment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicalRecords.map((record) => (
                          <tr key={record.id}>
                            <td>{record.date}</td>
                            <td>{record.doctor_name}</td>
                            <td>{record.diagnosis}</td>
                            <td>{record.treatment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No medical records found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
