'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import PatientDetailView from './PatientDetailView';
import PrescriptionForm from './PrescriptionForm';
import ConsultationForm from './ConsultationForm';

type Patient = { id: number; name: string; mobile: string | null; };
type Visit = { id: number; date: string | Date; symptoms: string | null; chiefComplaint?: string | null; prescription: any[] };

export default function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React's use() hook to unwrap the promise in client components
  const { id } = use(params);
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedVisitForPrescription, setSelectedVisitForPrescription] = useState<Visit | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientRes, visitsRes] = await Promise.all([
        fetch(`/api/patients/${id}`),
        fetch(`/api/consultations?patientId=${id}`)
      ]);
      if (!patientRes.ok) throw new Error('Failed to fetch patient details.');
      if (!visitsRes.ok) throw new Error('Failed to fetch visit history.');
      
      const patientData = await patientRes.json();
      const visitsData: Visit[] = await visitsRes.json();
      
      const visitsWithPrescriptions = await Promise.all(
        visitsData.map(async (visit) => {
          try {
            const presRes = await fetch(`/api/prescriptions?visitId=${visit.id}`);
            const prescription = presRes.ok ? await presRes.json() : [];
            return { ...visit, prescription };
          } catch {
             return { ...visit, prescription: [] };
          }
        })
      );
      setPatient(patientData);
      setVisits(visitsWithPrescriptions);
    } catch (e: any) {
      setError(e.message ?? 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveSuccess = () => {
    setIsVisitModalOpen(false);
    setSelectedVisitForPrescription(null);
    fetchData();
  };
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/patients" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">&larr; Back to Patient List</Link>
        {patient && (
          <div>
            <Link href={`/admin/patients/${patient.id}/edit`} className="mr-4 text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit Patient</Link>
            <button onClick={() => setIsVisitModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700">Add New Visit</button>
          </div>
        )}
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}
      
      {!loading && !error && patient && (
        <PatientDetailView 
          patient={patient} 
          visits={visits} 
          onWritePrescription={(visit) => setSelectedVisitForPrescription(visit)} 
        />
      )}

      {isVisitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <ConsultationForm 
              patientId={id} 
              onSaveSuccess={handleSaveSuccess}
              onCancel={() => setIsVisitModalOpen(false)}
            />
          </div>
        </div>
      )}

      {selectedVisitForPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
             <button onClick={() => setSelectedVisitForPrescription(null)} className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            <PrescriptionForm 
              visitId={selectedVisitForPrescription.id}
              existingItems={selectedVisitForPrescription.prescription}
              onSaveSuccess={handleSaveSuccess} 
            />
          </div>
        </div>
      )}
    </div>
  );
}