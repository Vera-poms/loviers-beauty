import { prisma } from '../lib/prisma';

async function seed() {
  const categories = [
    { title: 'Braids', description: 'Professional braiding services', image: '/assets/3.png', braidingHours: '' },
    { title: 'Training', description: 'Hair styling training programs', image: '/assets/2.png', braidingHours: '' },
    { title: 'Lash', description: 'Expert lash extension services', image: '/assets/1.png', braidingHours: '' },
    { title: 'Extras', description: 'Additional beauty services', image: '/assets/4.png', braidingHours: '' },
  ];

  for (const category of categories) {
    const existing = await prisma.uploadService.findFirst({
      where: { title: category.title },
    });

    if (!existing) {
      await prisma.uploadService.create({ data: category });
      console.log(`Created: ${category.title}`);
    } else {
      console.log(`Already exists: ${category.title}`);
    }
  }

  const all = await prisma.uploadService.findMany();
  console.log('\nAll categories:', all);

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
