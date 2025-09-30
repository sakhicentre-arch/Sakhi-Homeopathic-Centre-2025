'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type PatientFormData = {
  name: string;
  phone: string;
  gender: string;
};

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState<PatientFormData>({ name: '', phone: '', gender: '' });
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // --- NEW: State for phone number validation error ---
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${id}`);
        if (!response.ok) throw new Error('Failed to fetch patient data');
        const data = await response.json();
        setFormData({ name: data.name, phone: data.mobile || '', gender: data.gender || '' });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchPatient();
  }, [id]);
  
  // --- NEW: Validation function ---
  const validatePhone = (phoneNumber: string): boolean => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      setPhoneError('');
      return true;
    } else {
      setPhoneError('Phone number must be between 10 and 15 digits.');
      return false;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setFormData((prev) => ({ ...prev, phone: newPhone }));
    validatePhone(newPhone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validatePhone(formData.phone)) return;

    setIsSubmitting(true);
    setMessage('');
    setError(null);

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update patient');

      setMessage('Patient updated successfully!');
      setTimeout(() => {
        router.push('/admin/patients');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) return <p className="p-8 text-center">Loading patient data...</p>;
  if (error && !message) return <p className="p-8 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Patient</h1>
      <div className="max-w-xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name" name="name" type="text" value={formData.name} onChange={handleChange} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone" name="phone" type="tel" value={formData.phone}
                // --- UPDATED: Use the new change handler ---
                onChange={handlePhoneChange}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {/* --- NEW: Display the error message --- */}
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender" name="gender" value={formData.gender} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex items-center justify-end space-x-4 pt-2">
              <Link href="/admin/patients" className="text-sm text-gray-600 hover:text-gray-900">
                Cancel
              </Link>
              <button
                type="submit" disabled={isSubmitting}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isSubmitting ? 'Updating...' : 'Update Patient'}
              </button>
            </div>

            {message && <p className="text-sm text-green-600 text-center mt-4">{message}</p>}
            {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}