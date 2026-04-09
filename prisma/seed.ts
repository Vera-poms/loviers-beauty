import { prisma } from '../lib/prisma';

async function seed() {
  const categories = [
    { title: 'Braids', description: 'Professional braiding services', image: '/assets/3.png', braidingHours: '' },
    { title: 'Training', description: 'Hair styling training programs', image: '/assets/2.png', braidingHours: '' },
    { title: 'Lash', description: 'Expert lash extension services', image: '/assets/1.png', braidingHours: '' },
    { title: 'Extras', description: 'Additional beauty services', image: '/assets/4.png', braidingHours: '' },
  ];

  const subcategoriesMap: Record<string, string[]> = {
    'Braids': ['Box Braids', 'Cornrows', 'Knotless Braids', 'Twist Braids', 'Fulani Braids'],
    'Training': ['Beginner', 'Intermediate', 'Advanced', 'Masterclass'],
    'Lash': ['Classic Lashes', 'Volume Lashes', 'Hybrid Lashes', 'Mega Volume'],
    'Extras': ['Hair Wash', 'Deep Conditioning', 'Scalp Treatment', 'Hair Coloring'],
  };

  for (const category of categories) {
    const existing = await prisma.uploadService.findFirst({
      where: { title: category.title },
    });

    if (!existing) {
      const service = await prisma.uploadService.create({ data: category });
      console.log(`Created: ${category.title}`);

      const subs = subcategoriesMap[category.title] || [];
      for (const subName of subs) {
        await prisma.subcategory.create({
          data: { name: subName, serviceId: service.id },
        });
      }
      console.log(`  Added ${subs.length} subcategories`);
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
