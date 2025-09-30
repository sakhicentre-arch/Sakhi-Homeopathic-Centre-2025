'use client';

import { useState, FormEvent } from 'react';

// A prop to allow the parent component to trigger a refresh
interface AddPatientFormProps {
  onPatientAdded: () => void;
  key?: any;
}

export default function AddPatientForm({ onPatientAdded }: AddPatientFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // --- NEW: State for phone number validation error ---
  const [phoneError, setPhoneError] = useState('');

  // --- NEW: Validation function ---
  const validatePhone = (phoneNumber: string): boolean => {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // Check if the number of digits is between 10 and 15
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      setPhoneError(''); // No error
      return true;
    } else {
      setPhoneError('Phone number must be between 10 and 15 digits.');
      return false;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    // Validate on every change
    validatePhone(newPhone);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // --- NEW: Final validation check before submitting ---
    if (!validatePhone(phone)) {
      return; // Stop submission if phone is invalid
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, gender, age: age === '' ? null : age, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save patient');
      }

      setName('');
      setPhone('');
      setAge('');
      setNotes('');
      setGender('');
      setMessage('Patient saved successfully!');
      onPatientAdded();
    } catch (error) {
      console.error(error);
      setMessage('Error: Could not save patient.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (other form fields remain the same) ... */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            required disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone" name="phone" type="tel" value={phone}
            // --- UPDATED: Use the new change handler ---
            onChange={handlePhoneChange}
            required disabled={isLoading}
            // Add a red border if there's an error
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
          />
          {/* --- NEW: Display the error message right below the input --- */}
          {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            id="age" name="age" type="number" value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" min="0"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading} rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isLoading ? 'Saving...' : 'Save Patient'}
        </button>

        {message && <p className={`text-sm mt-2 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>
    </div>
  );
}