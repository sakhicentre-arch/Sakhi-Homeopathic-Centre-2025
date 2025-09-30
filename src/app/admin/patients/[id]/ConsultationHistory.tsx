'use client';

import { useMemo } from 'react';

type ConsultationItem = {
  id: number | string;
  date?: string | Date | null;
  chiefComplaint?: string | null;
  caseDetails?: any;
};

function fmtIN(input?: string | Date | null) {
  if (!input) return 'No date';
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime())
    ? 'No date'
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ConsultationHistory({
  consultations,
  onSelect,
}: {
  consultations: ConsultationItem[];
  onSelect?: (c: ConsultationItem) => void;
}) {
  const items = useMemo(
    () =>
      (consultations ?? []).map((c) => ({
        ...c,
        label: fmtIN(c.date),
      })),
    [consultations]
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Consultation History</h3>
      </div>

      {items.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">No consultations found.</div>
      ) : (
        <ul role="list" className="divide-y">
          {items.map((c) => (
            <li key={c.id} className="px-1">
              <button
                type="button"
                className="w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                onClick={() => onSelect?.(c)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Consultation</p>
                  <p className="text-sm text-gray-600">{(c as any).label}</p>
                </div>
                {c.chiefComplaint ? (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">{c.chiefComplaint}</p>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
