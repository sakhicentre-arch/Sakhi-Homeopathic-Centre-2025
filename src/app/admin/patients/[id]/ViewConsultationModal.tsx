'use client';

import { Consultation } from '@prisma/client';
import dynamic from 'next/dynamic';

// Dynamically import the PrescriptionForm
const PrescriptionForm = dynamic(() => import('./PrescriptionForm'), { ssr: false });

// Define a more specific type for the caseDetails JSON object
interface CaseDetails {
  observations: { [key: string]: string };
  mind: { [key:string]: string };
  generals: { [key: string]: string };
}

// Helper component to display a section of the consultation
const DetailSection = ({ title, data }: { title: string; data?: { [key: string]: string } | string | null }) => {
  if (!data || (typeof data === 'object' && Object.values(data).every(val => !val))) {
    return null;
  }
  // ... (rest of DetailSection component is the same)
};


export default function ViewConsultationModal({
  consultation,
  onClose,
}: {
  consultation: Consultation;
  onClose: () => void;
}) {
  const caseDetails = consultation.caseDetails as unknown as CaseDetails;

  return (
    // The modal overlay
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fadeIn"
    >
      {/* The modal content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Consultation Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">Consultation Date</dt>
            <dd className="text-sm text-gray-900 col-span-2">
              {new Date(consultation.consultationDate).toLocaleDateString('en-IN', { dateStyle: 'full' })}
            </dd>
          </div>
          
          <DetailSection title="Chief Complaint" data={consultation.chiefComplaint} />
          <DetailSection title="Observations" data={caseDetails?.observations} />
          <DetailSection title="Generals" data={caseDetails?.generals} />
          <DetailSection title="Mind" data={caseDetails?.mind} />

          {/* --- NEW: Prescription Form Added Below --- */}
          <div className="pt-4 border-t">
            <PrescriptionForm consultationId={consultation.id} />
          </div>
        </div>
      </div>
    </div>
  );
}