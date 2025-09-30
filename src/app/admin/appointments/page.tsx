'use client';

import { useState, useEffect } from 'react';

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  notes?: string;
  patient: {
    name: string;
    phone: string;
  };
  clinic: {
    name: string;
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading appointments...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Patient Appointments</h1>
        <a 
          href="/admin/appointments/new" 
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Book New Appointment
        </a>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No appointments found.</p>
          <a href="/admin/appointments/new" style={{ color: '#2196f3' }}>
            Book the first appointment
          </a>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>PATIENT NAME</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>PHONE NUMBER</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>APPOINTMENT TIME</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>CLINIC</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>STATUS</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {appointment.patient.name}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {appointment.patient.phone}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {appointment.clinic.name}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: appointment.status === 'SCHEDULED' ? '#e3f2fd' : '#f3e5f5',
                      color: appointment.status === 'SCHEDULED' ? '#1976d2' : '#7b1fa2',
                    }}>
                      {appointment.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <button style={{ marginRight: '5px', padding: '4px 8px', fontSize: '12px' }}>
                      Edit
                    </button>
                    <button style={{ padding: '4px 8px', fontSize: '12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
