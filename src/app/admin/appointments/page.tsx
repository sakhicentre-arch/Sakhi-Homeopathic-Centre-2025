import { PrismaClient, AppointmentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        clinic: {
          select: { name: true },
        },
      },
      orderBy: {
        appointmentTime: 'desc',
      },
    });
    return appointments;
  } catch (error) {
    console.error("UI Data Fetch Error: Failed to fetch appointments for AppointmentsPage.", error);
    return [];
  }
}

// Helper function to determine the status badge style
const getStatusBadge = (status: AppointmentStatus, appointmentTime: Date) => {
    const now = new Date();
    const isPast = new Date(appointmentTime) < now;

    if (status === 'PENDING' && isPast) {
        // Special status for past, pending appointments
        return {
            text: 'ATTENTION',
            className: 'bg-red-100 text-red-800'
        };
    }

    switch(status) {
        case 'CONFIRMED':
            return { text: 'CONFIRMED', className: 'bg-blue-100 text-blue-800' };
        case 'COMPLETED':
            return { text: 'COMPLETED', className: 'bg-green-100 text-green-800' };
        case 'CANCELLED':
            return { text: 'CANCELLED', className: 'bg-gray-100 text-gray-800' };
        case 'PENDING':
        default:
            return { text: 'PENDING', className: 'bg-yellow-100 text-yellow-800' };
    }
};

async function updateAppointmentStatus(appointmentId: number, newStatus: AppointmentStatus) {
  'use server';
  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });
    revalidatePath('/admin/appointments'); // Revalidate the page to show updated status
  } catch (error) {
    console.error(`Failed to update status for appointment ${appointmentId}:`, error);
    // In a real app, you might want to return an error message to the client
  }
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Patient Appointments</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => {
                    const statusBadge = getStatusBadge(appointment.status, appointment.appointmentTime);
                    return (
                        <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patientName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(appointment.appointmentTime).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.clinic.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.className}`}>
                                    {statusBadge.text}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <form action={updateAppointmentStatus}>
                                <input type="hidden" name="appointmentId" value={appointment.id} />
                                <select
                                  name="newStatus"
                                  defaultValue={appointment.status}
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                                >
                                  {Object.values(AppointmentStatus).map((statusOption) => (
                                    <option key={statusOption} value={statusOption}>
                                      {statusOption}
                                    </option>
                                  ))}
                                </select>
                              </form>
                            </td>
                        </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}



