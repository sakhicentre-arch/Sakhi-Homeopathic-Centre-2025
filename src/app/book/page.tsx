import { PrismaClient } from '@prisma/client';
import BookingForm from './BookingForm'; // Import the new client component

const prisma = new PrismaClient();

interface Clinic {
  id: number;
  name: string;
}

// This function runs on the server to get the clinic list.
async function getClinics(): Promise<Clinic[]> {
  try {
    const clinics = await prisma.clinic.findMany({
      where: { is_active: true },
      select: { id: true, name: true },
    });
    return clinics;
  } catch (error) {
    console.error("UI Data Fetch Error: Failed to fetch clinics for BookingPage.", error);
    return []; // Return an empty array on error
  }
}

// This is the main server component for the page.
// It fetches data and then passes it to the client component.
export default async function BookingPage() {
  const clinics = await getClinics();

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <BookingForm clinics={clinics} />
      </div>
    </div>
  );
}

