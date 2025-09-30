import { PrismaClient } from '@prisma/client';
import AddClinicForm from './AddClinicForm';

export interface Clinic {
  id: number;
  name: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const prisma = new PrismaClient();

async function getClinics(): Promise<Clinic[]> {
  try {
    const clinics = await prisma.clinic.findMany({
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Clinic Management</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {clinic.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {clinic.address || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                    No clinics found. Add one below to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <AddClinicForm />
      </div>
    </div>
  );
}
