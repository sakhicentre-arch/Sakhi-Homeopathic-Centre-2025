'use client';

import { useState, FormEvent } from 'react';

export default function QuestionnairePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-10 bg-white rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
          <p className="text-gray-700">Your information has been submitted successfully.</p>
          <p className="text-gray-700 mt-2">The clinic will be in touch with you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">New Patient Information Form</h1>
        <p className="text-center text-gray-500 mb-8">Please fill out this form before your first visit.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          
          {/* Chief Complaint */}
          <div>
            <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700">What is the main reason for your visit? (Chief Complaint) <span className="text-red-500">*</span></label>
            <textarea name="chiefComplaint" id="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          
          <div>
            <label htmlFor="historyOfPresentIllness" className="block text-sm font-medium text-gray-700">Please describe your issue in more detail.</label>
            <textarea name="historyOfPresentIllness" id="historyOfPresentIllness" value={formData.historyOfPresentIllness} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
              {isLoading ? 'Submitting...' : 'Submit Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}