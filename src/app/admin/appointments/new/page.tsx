'use client';

import { useState, useEffect } from 'react';

interface Patient {
  id: number;
  name: string;
  phone: string;
  gender?: string;
}

export default function NewAppointmentPage() {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    patientPhone: '',
    date: '',
    time: '',
    notes: '',
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Load existing patients when component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
        console.log('Loaded patients:', data);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Prepare appointment data
      const appointmentData = {
        ...(isNewPatient 
          ? { 
              patientName: formData.patientName,
              patientPhone: formData.patientPhone,
            }
          : { 
              patientId: parseInt(formData.patientId, 10),
            }
        ),
        date: formData.date,
        time: formData.time,
        clinicId: 1, // Default clinic
        notes: formData.notes || null,
      };

      console.log('Submitting appointment data:', appointmentData);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage('✅ Appointment booked successfully!');
        console.log('Appointment created:', result);
        
        // Reset form
        setFormData({
          patientId: '',
          patientName: '',
          patientPhone: '',
          date: '',
          time: '',
          notes: '',
        });
        
        // Refresh patients list in case a new patient was created
        if (isNewPatient) {
          await fetchPatients();
        }
      } else {
        setMessageType('error');
        setMessage(`❌ Error: ${result.error || result.message || 'Failed to book appointment'}`);
        console.error('Appointment creation failed:', result);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Error: Network error. Please check your connection and try again.');
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatientTypeChange = (newPatient: boolean) => {
    setIsNewPatient(newPatient);
    // Clear patient selection when switching types
    setFormData(prev => ({
      ...prev,
      patientId: '',
      patientName: '',
      patientPhone: '',
    }));
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#333', 
            marginBottom: '10px',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            📅 Book New Appointment
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Schedule an appointment for an existing patient or create a new patient record.
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            style={{
              padding: '15px',
              marginBottom: '25px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: messageType === 'error' ? '#ffebee' : '#e8f5e8',
              color: messageType === 'error' ? '#c62828' : '#2e7d32',
              border: `2px solid ${messageType === 'error' ? '#ef5350' : '#4caf50'}`,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Patient Type Selection */}
          <div style={{ 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>👤 Select Patient Type</h3>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="patientType"
                checked={!isNewPatient}
                onChange={() => handlePatientTypeChange(false)}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <strong>Existing Patient</strong> - Select from registered patients
            </label>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="patientType"
                checked={isNewPatient}
                onChange={() => handlePatientTypeChange(true)}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <strong>New Patient</strong> - Create new patient record
            </label>
          </div>

          {/* Patient Selection/Input */}
          {!isNewPatient ? (
            // Existing Patient Dropdown
            <div style={{ marginBottom: '25px' }}>
              <label htmlFor="patientId" style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                👥 Select Patient <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Choose a patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.phone} {patient.gender ? `(${patient.gender})` : ''}
                  </option>
                ))}
              </select>
              {patients.length === 0 && (
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  fontStyle: 'italic'
                }}>
                  No patients found. You may need to add patients first.
                </p>
              )}
            </div>
          ) : (
            // New Patient Fields
            <div style={{ 
              marginBottom: '25px',
              padding: '20px',
              backgroundColor: '#f0f8ff',
              borderRadius: '6px',
              border: '1px solid #b3d9ff'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>➕ New Patient Information</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="patientName" style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Full Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required={isNewPatient}
                  placeholder="Enter patient's full name"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="patientPhone" style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Phone Number <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="tel"
                  id="patientPhone"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  required={isNewPatient}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Appointment Date and Time */}
          <div style={{ 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#fff9f0',
            borderRadius: '6px',
            border: '1px solid #ffd8a6'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>🕐 Appointment Schedule</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label htmlFor="date" style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Date <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label htmlFor="time" style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Time <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="notes" style={{ 
              display: 'block',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              📝 Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Additional notes about the appointment (symptoms, concerns, etc.)"
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a 
              href="/admin/appointments" 
              style={{ 
                color: '#666',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '12px 20px'
              }}
            >
              ← Back to Appointments
            </a>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#cccccc' : '#4caf50',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                minWidth: '180px',
                boxShadow: loading ? 'none' : '0 2px 5px rgba(76,175,80,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? '⏳ Booking...' : '📅 Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
