'use client';

import { useState, FormEvent } from 'react';

export default function QuestionnaireForm() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', dob: '', gender: '', address: '',
    chiefComplaint: '', historyOfPresentIllness: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const maxDate = new Date().toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit the form. Please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (submitted) {
      return (
          <div className="p-10 bg-white rounded-lg shadow-xl text-center">
              <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
              <p className="text-gray-700">Your information has been submitted successfully.</p>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">New Patient Information Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]*" maxLength={10} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} max={maxDate} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="chiefComplaint">Chief Complaint <span className="text-red-500">*</span></label>
            <textarea name="chiefComplaint" id="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          {/* Other fields like email, address, etc. can be added here */}
          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              {isLoading ? 'Submitting...' : 'Submit Information'}
            </button>
          </div>
          {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
        </form>
    </div>
  );
}