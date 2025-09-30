'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditRemedyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [commonName, setCommonName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRemedy = async () => {
      try {
        const response = await fetch(`/api/remedies/${id}`);
        if (!response.ok) throw new Error('Remedy not found');
        const data = await response.json();
        setName(data.name);
        setAbbreviation(data.abbreviation || '');
        setCommonName(data.commonName || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRemedy();
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors
    try {
      const response = await fetch(`/api/remedies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, abbreviation, commonName }),
      });
      
      // --- IMPROVEMENT: Show specific error message from the API ---
      if (!response.ok) {
        // Try to get a specific text error from the API, or fall back to a generic one
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update remedy');
      }

      router.push('/admin/remedies');

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="p-8 text-center">Loading remedy...</p>;
  
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Remedy</h1>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Remedy Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700">Abbreviation</label>
            <input id="abbreviation" type="text" value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="commonName" className="block text-sm font-medium text-gray-700">Common Name</label>
            <input id="commonName" type="text" value={commonName} onChange={(e) => setCommonName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex justify-end space-x-4 pt-2">
            <Link href="/admin/remedies" className="py-2 px-4 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
              {isLoading ? 'Updating...' : 'Update Remedy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}