'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import Link from 'next/link';

type Remedy = {
  id: number;
  name: string;
  abbreviation: string | null;
  commonName: string | null;
};

function AddRemedyForm({ onRemedyAdded }: { onRemedyAdded: () => void }) {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [commonName, setCommonName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/remedies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, abbreviation, commonName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save remedy');
      }
      setName('');
      setAbbreviation('');
      setCommonName('');
      setMessage('Remedy saved successfully!');
      onRemedyAdded();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Remedy</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Remedy Name</label>
          <input id="name" name="name" type="text" placeholder="e.g., Arnica Montana" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700">Abbreviation</label>
          <input id="abbreviation" name="abbreviation" type="text" placeholder="e.g., arn." value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} disabled={isLoading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="commonName" className="block text-sm font-medium text-gray-700">Common Name</label>
          <input id="commonName" name="commonName" type="text" placeholder="e.g., Leopard's Bane" value={commonName} onChange={(e) => setCommonName(e.target.value)} disabled={isLoading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
          {isLoading ? 'Saving...' : 'Save Remedy'}
        </button>
        {message && <p className={`text-sm mt-2 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>
    </div>
  );
}

function RemedyList({ remedies, isLoading, onDelete }: { remedies: Remedy[], isLoading: boolean, onDelete: (id: number) => void }) {
  if (isLoading) return <p className="text-center p-4">Loading remedies...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Remedy Master List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abbreviation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Common Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {remedies.length > 0 ? (
              remedies.map((remedy) => (
                <tr key={remedy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{remedy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{remedy.abbreviation || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{remedy.commonName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link href={`/admin/remedies/${remedy.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </Link>
                    <button onClick={() => onDelete(remedy.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No remedies found. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RemedyManagementPage() {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRemedies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/remedies');
      if (!response.ok) throw new Error('Failed to fetch remedies');
      const data = await response.json();
      setRemedies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRemedies();
  }, [fetchRemedies]);

  const handleDelete = async (remedyId: number) => {
    if (!window.confirm('Are you sure you want to delete this remedy?')) return;
    try {
      const response = await fetch(`/api/remedies/${remedyId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete remedy');
      fetchRemedies();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Remedy Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RemedyList remedies={remedies} isLoading={isLoading} onDelete={handleDelete} />
        </div>
        <div>
          <AddRemedyForm onRemedyAdded={fetchRemedies} />
        </div>
      </div>
    </div>
  );
}