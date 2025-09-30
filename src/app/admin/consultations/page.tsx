'use client';

import { useState, useEffect } from 'react';

interface Consultation {
  id: number;
  chiefComplaint: string;
  symptoms?: string;
  diagnosis?: string;
  createdAt: string;
  patient: {
    name: string;
    phone: string;
  };
  appointment: {
    date: string;
    time: string;
  };
  prescriptions: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations');
      if (response.ok) {
        const data = await response.json();
        setConsultations(data);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading consultations...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🩺 Patient Consultations</h1>
        <a 
          href="/admin/consultations/new" 
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          + New Consultation
        </a>
      </div>

      {consultations.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <h2 style={{ color: '#6c757d', marginBottom: '10px' }}>No Consultations Yet</h2>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            Start by completing consultations for your scheduled appointments.
          </p>
          <a 
            href="/admin/consultations/new" 
            style={{ 
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            Complete Your First Consultation →
          </a>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>PATIENT</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>DATE & TIME</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>CHIEF COMPLAINT</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>DIAGNOSIS</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>PRESCRIPTIONS</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation) => (
                <tr key={consultation.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                  <td style={{ padding: '15px' }}>
                    <div>
                      <strong>{consultation.patient.name}</strong>
                      <br />
                      <small style={{ color: '#6c757d' }}>{consultation.patient.phone}</small>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div>
                      {new Date(consultation.appointment.date).toLocaleDateString()}
                      <br />
                      <small style={{ color: '#6c757d' }}>{consultation.appointment.time}</small>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ maxWidth: '200px' }}>
                      {consultation.chiefComplaint.length > 50 
                        ? consultation.chiefComplaint.substring(0, 50) + '...'
                        : consultation.chiefComplaint
                      }
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ maxWidth: '150px' }}>
                      {consultation.diagnosis ? (
                        consultation.diagnosis.length > 40
                          ? consultation.diagnosis.substring(0, 40) + '...'
                          : consultation.diagnosis
                      ) : (
                        <em style={{ color: '#6c757d' }}>Not specified</em>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {consultation.prescriptions.length} medicines
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '14px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.location.href = `/admin/consultations/${consultation.id}`}
                      >
                        View
                      </button>
                      <button 
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '14px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <h3 style={{ color: '#495057', marginBottom: '10px' }}>📊 Quick Stats</h3>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Total Consultations: <strong>{consultations.length}</strong>
        </p>
      </div>
    </div>
  );
}
