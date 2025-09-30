import { PrismaClient } from '@prisma/client';
import AddClinicForm from './AddClinicForm';
import ClinicActions from './ClinicActions';

export interface Clinic {
  id: number;
  name: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    patients: number;
    appointments: number;
    consultations: number;
  };
}

const prisma = new PrismaClient();

async function getClinics(): Promise<Clinic[]> {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        _count: {
          select: {
            patients: true,
            appointments: true,
            consultations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return clinics;
  } catch (error) {
    console.error("UI Data Fetch Error: Failed to fetch clinics for ClinicsPage.", error);
    return [];
  }
}

export default async function ClinicsPage() {
  const clinics = await getClinics();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          🏥 Clinic Management
        </h1>
        <p style={{ color: '#666' }}>
          Manage your clinic locations and view statistics.
        </p>
      </div>

      {/* Clinic Statistics */}
      {clinics.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {clinics.length}
            </div>
            <div style={{ color: '#666' }}>Total Clinics</div>
          </div>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
              {clinics.reduce((sum, clinic) => sum + (clinic._count?.patients || 0), 0)}
            </div>
            <div style={{ color: '#666' }}>Total Patients</div>
          </div>
          <div style={{ 
            backgroundColor: '#fff3e0', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
              {clinics.reduce((sum, clinic) => sum + (clinic._count?.appointments || 0), 0)}
            </div>
            <div style={{ color: '#666' }}>Total Appointments</div>
          </div>
          <div style={{ 
            backgroundColor: '#f3e5f5', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>
              {clinics.reduce((sum, clinic) => sum + (clinic._count?.consultations || 0), 0)}
            </div>
            <div style={{ color: '#666' }}>Total Consultations</div>
          </div>
        </div>
      )}

      {/* Clinics List */}
      <div style={{ 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            Existing Clinics
          </h2>
        </div>
        
        {clinics.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Address</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Patients</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Appointments</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Consultations</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Created</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '15px', fontWeight: '600' }}>{clinic.name}</td>
                    <td style={{ padding: '15px', color: '#666' }}>{clinic.address || 'N/A'}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: '#e3f2fd', 
                        color: '#1976d2', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {clinic._count?.patients || 0}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: '#e8f5e8', 
                        color: '#388e3c', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {clinic._count?.appointments || 0}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: '#f3e5f5', 
                        color: '#7b1fa2', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {clinic._count?.consultations || 0}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                      {new Date(clinic.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <ClinicActions clinic={clinic} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            No clinics found. Add one below to get started.
          </div>
        )}
      </div>

      {/* Add Clinic Form */}
      <div style={{ 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <AddClinicForm />
      </div>
    </div>
  );
}
