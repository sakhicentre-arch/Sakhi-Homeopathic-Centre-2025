import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Sakhi Homeopathic Centre
          </h1>
          <p className="text-gray-600">
            Logged in as: {session.user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Cards - All Preserved */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Patient Management
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage patient records and appointments
            </p>
            <a href="/admin/patients" className="text-blue-600 hover:text-blue-800">
              View Patients →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Appointments
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Schedule and manage appointments
            </p>
            <a href="/admin/appointments" className="text-blue-600 hover:text-blue-800">
              View Appointments →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Consultations
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage patient consultations
            </p>
            <a href="/admin/consultations" className="text-blue-600 hover:text-blue-800">
              View Consultations →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Clinic Settings
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage clinic locations and settings
            </p>
            <a href="/admin/clinics" className="text-blue-600 hover:text-blue-800">
              View Clinics →
            </a>
          </div>
        </div>

        {/* Status Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            System Status: Demo Mode
          </h4>
          <p className="text-sm text-blue-700">
            Currently running in demo mode. Full database integration available in next phase.
          </p>
        </div>
      </div>
    </div>
  )
}
