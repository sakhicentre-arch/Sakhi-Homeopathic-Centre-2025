import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a default clinic with ID=1 if it doesn't exist
  await prisma.clinic.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Sakhi Homeopathic Centre',
      address: '4th Floor, Shiv Pooja Complex, Above Bank of Baroda, City Light, Surat',
      phone: '9876543210',
      email: 'info@sakhihomeopathic.com',
    },
  });
  console.log('Default clinic ensured.');

  // Create some sample remedies
  const remedies = [
    { name: 'Arnica Montana' },
    { name: 'Belladonna' },
    { name: 'Nux Vomica' },
    { name: 'Pulsatilla' },
    { name: 'Sulphur' },
  ];
  
  for (const remedy of remedies) {
    await prisma.remedy.upsert({
      where: { name: remedy.name },
      update: {},
      create: remedy,
    });
  }
  console.log('Sample remedies seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
