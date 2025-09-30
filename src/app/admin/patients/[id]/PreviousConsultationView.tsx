'use client';

import { Consultation } from '@prisma/client';

interface CaseDetails {
  observations: { [key: string]: string }
  mind: { [key: string]: string }
  generals: { [key: string]: string }
}

const DetailSection = ({ title, data }: { title: string; data?: { [key: string]: string } | string }) => {
  if (!data || (typeof data === 'object' && Object.values(data).every(val => !val))) return null;

  if (typeof data === 'string') {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">{title}</h3>
        <p className="text-sm text-gray-900 whitespace-pre-wrap">{data}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">{title}</h3>
      <dl className="space-y-2">
        {Object.entries(data).map(([key, value]) =>
          value ? (
            <div key={key} className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
              <dd className="text-sm text-gray-900 col-span-2 whitespace-pre-wrap">{value}</dd>
            </div>
          ) : null
        )}
      </dl>
    </div>
  );
};

function formatINDate(input?: string | Date | null) {
  if (!input) return 'No date';
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return 'No date';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PreviousConsultationView({ consultation }: { consultation: Consultation | null }) {
  if (!consultation) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Previous Consultation</h2>
        <p className="text-gray-500 text-sm">This is the patient's first consultation.</p>
      </div>
    );
  }

  const label = formatINDate((consultation as any)?.date);
  const caseDetails = (consultation.caseDetails ?? {}) as unknown as CaseDetails;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Previous Consultation ({label})</h2>
      <div className="space-y-4">
        <DetailSection title="Chief Complaint" data={consultation.chiefComplaint ?? ''} />
        <DetailSection title="Observations" data={caseDetails?.observations} />
        <DetailSection title="Generals" data={caseDetails?.generals} />
        <DetailSection title="Mind" data={caseDetails?.mind} />
      </div>
    </div>
  );
}
