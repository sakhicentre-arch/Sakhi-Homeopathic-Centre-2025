import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Unauthorized Access
        </h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
        <Link href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Go to Login Page
        </Link>
      </div>
    </div>
  );
}
