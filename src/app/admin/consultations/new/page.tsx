'use client';

import { useState, useEffect } from 'react';

interface Appointment {
  id: number;
  date: string;
  time: string;
  patient: {
    id: number;
    name: string;
    phone: string;
    gender?: string;
  };
  status: string;
}

interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function NewConsultationPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    appointmentId: '',
    chiefComplaint: '',
    symptoms: '',
    diagnosis: '',
    treatmentPlan: '',
    notes: '',
    followUpDate: '',
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Common homeopathic remedies
  const commonRemedies = [
    'Arnica Montana', 'Belladonna', 'Nux Vomica', 'Pulsatilla', 'Sulphur',
    'Bryonia', 'Rhus Tox', 'Apis Mellifica', 'Arsenicum Album', 'Calcarea Carbonica',
    'Lycopodium', 'Phosphorus', 'Sepia', 'Natrum Muriaticum', 'Silicea'
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        const pendingAppointments = data.filter((apt: Appointment) => 
          apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED'
        );
        setAppointments(pendingAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAppointmentSelect = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id.toString() === appointmentId);
    setSelectedAppointment(appointment || null);
    setFormData(prev => ({ ...prev, appointmentId }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (index: number, field: keyof Prescription, value: string) => {
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
    setPrescriptions(newPrescriptions);
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removePrescription = (index: number) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const validPrescriptions = prescriptions.filter(p => 
        p.medicine.trim() && p.dosage.trim() && p.frequency.trim() && p.duration.trim()
      );

      const consultationData = {
        ...formData,
        patientId: selectedAppointment?.patient.id,
        prescriptions: validPrescriptions,
      };

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage('✅ Consultation completed successfully!');
        
        // Reset form
        setFormData({
          appointmentId: '',
          chiefComplaint: '',
          symptoms: '',
          diagnosis: '',
          treatmentPlan: '',
          notes: '',
          followUpDate: '',
        });
        setPrescriptions([{ medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
        setSelectedAppointment(null);
        
        await fetchAppointments();
      } else {
        setMessageType('error');
        setMessage(`❌ Error: ${result.error || result.message || 'Failed to create consultation'}`);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Error: Network error. Please try again.');
      console.error('Consultation creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1000px', 
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
            🩺 New Consultation
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Complete the consultation and create prescription for the patient.
          </p>
        </div>

        {/* Messages */}
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
          
          {/* Appointment Selection */}
          <div style={{ 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>📅 Select Appointment</h3>
            
            <select
              name="appointmentId"
              value={formData.appointmentId}
              onChange={(e) => handleAppointmentSelect(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Choose an appointment...</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.patient.name} - {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </option>
              ))}
            </select>

            {selectedAppointment && (
              <div style={{ 
                marginTop: '15px',
                padding: '15px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                border: '1px solid #bbdefb'
              }}>
                <h4 style={{ color: '#1565c0', marginBottom: '10px' }}>Selected Patient:</h4>
                <p><strong>Name:</strong> {selectedAppointment.patient.name}</p>
                <p><strong>Phone:</strong> {selectedAppointment.patient.phone}</p>
                <p><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedAppointment.time}</p>
              </div>
            )}
          </div>

          {/* Chief Complaint */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="chiefComplaint" style={{ 
              display: 'block',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              🗣️ Chief Complaint <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <textarea
              id="chiefComplaint"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="What is the patient's main concern?"
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Symptoms */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="symptoms" style={{ 
              display: 'block',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              🤒 Symptoms & History
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detailed symptoms, medical history, duration, intensity, etc."
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="diagnosis" style={{ 
              display: 'block',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              🔍 Diagnosis
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              rows={3}
              placeholder="Your clinical diagnosis and assessment"
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Prescriptions */}
          <div style={{ 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            border: '1px solid #ffcc02'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#333' }}>💊 Prescriptions</h3>
              <button
                type="button"
                onClick={addPrescription}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                + Add Medicine
              </button>
            </div>

            {prescriptions.map((prescription, index) => (
              <div key={index} style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: '#333' }}>Medicine #{index + 1}</h4>
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrescription(index)}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={prescription.medicine}
                    onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                    list={`remedies-${index}`}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <datalist id={`remedies-${index}`}>
                    {commonRemedies.map((remedy) => (
                      <option key={remedy} value={remedy} />
                    ))}
                  </datalist>
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={prescription.dosage}
                    onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={prescription.frequency}
                    onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={prescription.duration}
                    onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Special instructions (optional)"
                  value={prescription.instructions}
                  onChange={(e) => handlePrescriptionChange(index, 'instructions', e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          {/* Treatment Plan */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="treatmentPlan" style={{ 
              display: 'block',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              📋 Treatment Plan
            </label>
            <textarea
              id="treatmentPlan"
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleInputChange}
              rows={3}
              placeholder="Overall treatment plan and recommendations"
              style={{ 
                width: '100%', 
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Notes & Follow-up */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label htmlFor="notes" style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                📝 Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional notes"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label htmlFor="followUpDate" style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                📅 Follow-up Date
              </label>
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
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

          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a 
              href="/admin/consultations" 
              style={{ 
                color: '#666',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '12px 20px'
              }}
            >
              ← Back to Consultations
            </a>
            
            <button
              type="submit"
              disabled={loading || !selectedAppointment}
              style={{
                backgroundColor: loading || !selectedAppointment ? '#cccccc' : '#4caf50',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '6px',
                cursor: loading || !selectedAppointment ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              {loading ? '⏳ Saving...' : '✅ Complete Consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
