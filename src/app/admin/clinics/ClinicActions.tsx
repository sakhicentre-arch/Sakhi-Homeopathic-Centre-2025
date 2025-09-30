'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Clinic {
  id: number;
  name: string;
  address: string | null;
  _count?: {
    patients: number;
    appointments: number;
    consultations: number;
  };
}

interface ClinicActionsProps {
  clinic: Clinic;
}

export default function ClinicActions({ clinic }: ClinicActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(clinic.name);
  const [editAddress, setEditAddress] = useState(clinic.address || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleEdit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/clinics', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: clinic.id,
          name: editName,
          address: editAddress,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Clinic updated successfully!' });
        setIsEditing(false);
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update clinic' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const totalRecords = (clinic._count?.patients || 0) + (clinic._count?.appointments || 0) + (clinic._count?.consultations || 0);
    
    if (totalRecords > 0) {
      alert('Cannot delete clinic with existing patients, appointments, or consultations!');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${clinic.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/clinics', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clinic.id }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Clinic deleted successfully!' });
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to delete clinic' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const canDelete = (clinic._count?.patients || 0) === 0 && 
                   (clinic._count?.appointments || 0) === 0 && 
                   (clinic._count?.consultations || 0) === 0;

  if (isEditing) {
    return (
      <div style={{ minWidth: '200px' }}>
        {message && (
          <div style={{
            padding: '5px',
            marginBottom: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e8',
            color: message.type === 'error' ? '#c62828' : '#2e7d32',
          }}>
            {message.text}
          </div>
        )}
        
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            placeholder="Clinic name"
          />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            placeholder="Address"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={handleEdit}
            disabled={loading || !editName.trim()}
            style={{
              backgroundColor: loading ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              flex: 1
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditName(clinic.name);
              setEditAddress(clinic.address || '');
              setMessage(null);
            }}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              flex: 1
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
      {message && (
        <div style={{
          position: 'absolute',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e8',
          color: message.type === 'error' ? '#c62828' : '#2e7d32',
          zIndex: 1000,
          marginTop: '-30px'
        }}>
          {message.text}
        </div>
      )}
      
      <button
        onClick={() => setIsEditing(true)}
        disabled={loading}
        style={{
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '12px'
        }}
      >
        ✏️ Edit
      </button>
      
      <button
        onClick={handleDelete}
        disabled={loading || !canDelete}
        title={!canDelete ? 'Cannot delete clinic with existing records' : 'Delete clinic'}
        style={{
          backgroundColor: !canDelete ? '#ccc' : '#f44336',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: (!canDelete || loading) ? 'not-allowed' : 'pointer',
          fontSize: '12px'
        }}
      >
        🗑️ Delete
      </button>
    </div>
  );
}
