export default function PatientDashboardPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Patient Portal!</h1>
      <p className="text-gray-700">
        Here you can view your appointments, prescriptions, and visit history.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-indigo-700">Your Appointments</h3>
          <p className="text-indigo-600 text-sm">View upcoming and past appointments.</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-green-700">Your Prescriptions</h3>
          <p className="text-green-600 text-sm">Access your medication details.</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-yellow-700">Visit History</h3>
          <p className="text-yellow-600 text-sm">Review your past consultations.</p>
        </div>
      </div>
    </div>
  );
}
