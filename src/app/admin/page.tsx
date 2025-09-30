// src/app/admin/page.tsx
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <Link href="/admin/appointments" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">View Appointments</h5>
          <p className="font-normal text-gray-700">See all upcoming and past patient appointments.</p>
        </Link>

        <Link href="/admin/patients" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Patient Registry</h5>
          <p className="font-normal text-gray-700">Manage and view all patient records.</p>
        </Link>

        {/* Add more links here as we build more pages */}

      </div>
    </div>
  );
}