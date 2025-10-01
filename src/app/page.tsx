import Link from 'next/link'
import { getServerSession } from 'next-auth'

export default async function HomePage() {
  const session = await getServerSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">
                  Sakhi Homeopathic Centre
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <Link
                    href="/admin"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/login"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/admin/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-indigo-600">Sakhi Homeopathic Centre</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your trusted partner in holistic healthcare. Experience the healing power 
            of homeopathy with our expert practitioners and personalized treatment plans.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Expert Care */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Expert Care</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Experienced homeopathic practitioners dedicated to your wellness journey.
              </p>
            </div>

            {/* Personalized Treatment */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Personalized Treatment</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Customized treatment plans tailored to your unique health needs.
              </p>
            </div>

            {/* Modern Facilities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Modern Facilities</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                State-of-the-art clinic facilities with advanced digital management systems.
              </p>
            </div>
          </div>
        </div>

        {/* Clinic Locations */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Clinic Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dabholi Clinic */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">Dabholi Clinic</h4>
              <p className="text-gray-600 mb-2">Main Branch</p>
              <p className="text-sm text-gray-500">
                <strong>Hours:</strong> Mon-Sat 9:00 AM - 8:00 PM<br />
                <strong>Contact:</strong> Available for appointments
              </p>
            </div>

            {/* Citylight Clinic */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">Citylight Clinic</h4>
              <p className="text-gray-600 mb-2">Branch Office</p>
              <p className="text-sm text-gray-500">
                <strong>Hours:</strong> Mon-Fri 10:00 AM - 6:00 PM<br />
                <strong>Contact:</strong> Available for appointments
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Healing Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Book your consultation today and experience the difference of personalized homeopathic care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/admin/appointments"
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Book Appointment
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Login to Book Appointment
              </Link>
            )}
            <a
              href="tel:+919876543210"
              className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Sakhi Homeopathic Centre</h3>
            <p className="text-gray-400 mb-4">
              Dedicated to your health and wellness through natural homeopathic solutions
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Sakhi Homeopathic Centre. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
