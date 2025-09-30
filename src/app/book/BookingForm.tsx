'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Clinic {
  id: number;
  name: string;
}

export default function BookingForm({ clinics }: { clinics: Clinic[] }) {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (clinics.length > 0) {
      setClinicId(clinics[0].id.toString());
    }
  }, [clinics]);

  const validateForm = (): boolean => {
    if (!patientName || !patientPhone || !appointmentTime || !clinicId) {
      setError('Please fill out all fields.');
      return false;
    }
    if (!/^\d{10}$/.test(patientPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    const selectedDate = new Date(appointmentTime);
    const now = new Date();
    if (selectedDate < now) {
      setError('You cannot book an appointment in the past.');
      return false;
    }
    const hours = selectedDate.getHours();
    if (hours < 9 || hours >= 20) {
      setError('Bookings are only allowed between 9:00 AM and 8:00 PM.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone,
          appointmentTime: new Date(appointmentTime),
          clinicId: parseInt(clinicId),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to book appointment.');
      }

      alert('Appointment booked successfully!');
      setPatientName('');
      setPatientPhone('');
      setAppointmentTime('');
      if (clinics.length > 0) {
        setClinicId(clinics[0].id.toString());
      }
      router.refresh();

    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg space-y-6 animate-pulse">
         <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
         <div className="space-y-6 pt-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
         </div>
         <div className="h-12 bg-gray-300 rounded mt-6"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Book an Appointment</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input id="patientName" type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} required disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input id="patientPhone" type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} required disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="clinicId" className="block text-sm font-medium text-gray-700">Clinic Location</label>
        <select id="clinicId" value={clinicId} onChange={(e) => setClinicId(e.target.value)} required disabled={isLoading || clinics.length === 0} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="" disabled>Select a clinic</option>
          {clinics.map(clinic => (
            <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">Preferred Date and Time</label>
        <input id="appointmentTime" type="datetime-local" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
}