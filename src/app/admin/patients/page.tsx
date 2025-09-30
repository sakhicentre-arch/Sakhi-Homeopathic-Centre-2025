'use client'; 

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Keep this for AddPatientForm

// NOTE: The incorrect import for AddVisitForm has been removed.

type Patient = {
  id: number;
  name: string;
  phone: string;
  gender: string | null;
  mobile?: string | null; 
};

function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      const formattedData = data.map((p: Patient) => ({...p, phone: p.mobile || ''}));
      setPatients(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async (patientId: number) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      const response = await fetch(`/api/patients/${patientId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete patient');
      fetchPatients();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading patients...</p>;
  if (error) return <p className="text-red-500 text-center p-4">Error loading patients: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Patient Registry</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/patients/${patient.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                    {patient.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <Link href={`/admin/patients/${patient.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(patient.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const AddPatientForm = dynamic(() => import('./AddPatientForm'), { ssr: false });

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    // This is now the primary fetch function
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      const formattedData = data.map((p: Patient) => ({...p, phone: p.mobile || ''}));
      setPatients(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async (patientId: number) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      const response = await fetch(`/api/patients/${patientId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete patient');
      fetchPatients(); // Refreshes the list by calling the main fetch function
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* We now pass the data and functions down to the list component */}
          <PatientList patients={patients} isLoading={isLoading} error={error} onDelete={handleDelete} />
        </div>
        <div>
          {/* We pass the fetchPatients function so the form can trigger a refresh */}
          <AddPatientForm onPatientAdded={fetchPatients} />
        </div>
      </div>
    </div>
  );
}