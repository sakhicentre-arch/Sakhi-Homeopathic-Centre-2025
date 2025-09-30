'use client';

import { useState, FormEvent } from 'react';

interface AddVisitFormProps {
  patientId: number;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export default function AddVisitForm({ patientId, onSaveSuccess, onCancel }: AddVisitFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [fee, setFee] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patientId, 
          symptoms, 
          diagnosis, 
          fee: fee || 0,
          clinicId: 1 // We can make this dynamic later
        }),
      });
      if (!response.ok) throw new Error('Failed to save visit');

      setMessage('Visit saved successfully!');
      setTimeout(() => onSaveSuccess(), 1000);

    } catch (error) {
      console.error(error);
      setMessage('Error: Could not save visit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Visit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms</label>
          <textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <textarea id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Consultation Fee</label>
          <input type="number" id="fee" value={fee} onChange={(e) => setFee(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" min="0" />
        </div>
        <div className="flex justify-end items-center gap-4 pt-4">
            <button type="button" onClick={onCancel} className="py-2 px-4 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">
                Cancel
            </button>
            <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                {isLoading ? 'Saving...' : 'Save Visit'}
            </button>
        </div>
        {message && <p className={`text-sm mt-2 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>
    </div>
  );
}