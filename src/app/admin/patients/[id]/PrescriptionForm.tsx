'use client';

import { useState, useEffect, FormEvent } from 'react';

// Define the shape of our data for type safety
interface RemedyMaster { id: number; name: string; }
interface PrescribedRemedy { remedyId: string; potency: string; dosage: string; }
interface PrescriptionFormProps {
  visitId: number;
  existingItems: any[]; // To pre-fill the form for editing
  onSaveSuccess: () => void;
}

export default function PrescriptionForm({ visitId, existingItems, onSaveSuccess }: PrescriptionFormProps) {
  const [remedyMasterList, setRemedyMasterList] = useState<RemedyMaster[]>([]);
  // Pre-fill the form if existing items are provided, otherwise start with one empty row
  const [remedies, setRemedies] = useState<PrescribedRemedy[]>(
    existingItems.length > 0
      ? existingItems.map(item => ({ remedyId: item.remedyId.toString(), potency: item.potency || '', dosage: item.dose || '' }))
      : [{ remedyId: '', potency: '', dosage: '' }]
  );
  const [notes, setNotes] = useState(existingItems[0]?.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch the master list of all available remedies for the dropdown
  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        const response = await fetch('/api/remedies');
        if (response.ok) {
          setRemedyMasterList(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch remedy master list:', error);
      }
    };
    fetchRemedies();
  }, []);

  const handleRemedyChange = (index: number, field: keyof PrescribedRemedy, value: string) => {
    const updatedRemedies = [...remedies];
    updatedRemedies[index][field] = value;
    setRemedies(updatedRemedies);
  };

  const addRemedy = () => setRemedies([...remedies, { remedyId: '', potency: '', dosage: '' }]);
  const removeRemedy = (index: number) => setRemedies(remedies.filter((_, i) => i !== index));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!visitId) return;
    setIsLoading(true);
    setMessage('');
    
    // Filter out any empty rows the user didn't fill
    const filledRemedies = remedies.filter(r => r.remedyId && r.potency && r.dosage);

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId, notes, remedies: filledRemedies }),
      });

      if (!response.ok) throw new Error('Failed to save prescription');
      
      setMessage('Prescription saved successfully!');
      setTimeout(() => onSaveSuccess(), 1000); // Notify parent to close and refresh

    } catch (error) {
      console.error(error);
      setMessage('Error: Could not save prescription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Prescription Writer</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {remedies.map((remedy, index) => (
          <div key={index} className="flex items-end space-x-2 p-2 border rounded-md bg-gray-50">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">Remedy Name</label>
              <select value={remedy.remedyId} onChange={(e) => handleRemedyChange(index, 'remedyId', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option value="">Select a remedy...</option>
                {remedyMasterList.map((masterRemedy) => (
                  <option key={masterRemedy.id} value={masterRemedy.id}>
                    {masterRemedy.name}
                  </option>
                ))}
              </select>
            </div>
             <div className="w-24">
              <label className="block text-sm font-medium text-gray-700">Potency</label>
              <input type="text" value={remedy.potency} onChange={(e) => handleRemedyChange(index, 'potency', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">Dosage</label>
              <input type="text" value={remedy.dosage} onChange={(e) => handleRemedyChange(index, 'dosage', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            {remedies.length > 1 && (
              <button type="button" onClick={() => removeRemedy(index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                &times;
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addRemedy} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">+ Add another remedy</button>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">General Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300">
            {isLoading ? 'Saving...' : 'Save Prescription'}
          </button>
          {message && <p className={`text-sm mt-2 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </div>
      </form>
    </div>
  );
}