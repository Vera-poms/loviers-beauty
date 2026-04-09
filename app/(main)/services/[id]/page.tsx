import ServiceDetails from "@/components/Services/ServiceDetails";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const fallbackServices = [
  { id: 1, image: '/assets/3.png', video: null, title: 'Braids', description: 'Professional braiding services', braidingHours: '' },
  { id: 2, image: '/assets/2.png', video: null, title: 'Training', description: 'Hair styling training programs', braidingHours: '' },
  { id: 3, image: '/assets/1.png', video: null, title: 'Lash', description: 'Expert lash extension services', braidingHours: '' },
  { id: 4, image: '/assets/4.png', video: null, title: 'Extras', description: 'Additional beauty services', braidingHours: '' },
];

const fallbackSubcategories: Record<number, { id: number; name: string; image: string | null }[]> = {
  1: [
    { id: 1, name: 'Box Braids', image: null },
    { id: 2, name: 'Cornrows', image: null },
    { id: 3, name: 'Knotless Braids', image: null },
    { id: 4, name: 'Twist Braids', image: null },
    { id: 5, name: 'Fulani Braids', image: null },
  ],
  2: [
    { id: 6, name: 'Beginner', image: null },
    { id: 7, name: 'Intermediate', image: null },
    { id: 8, name: 'Advanced', image: null },
    { id: 9, name: 'Masterclass', image: null },
  ],
  3: [
    { id: 10, name: 'Classic Lashes', image: null },
    { id: 11, name: 'Volume Lashes', image: null },
    { id: 12, name: 'Hybrid Lashes', image: null },
    { id: 13, name: 'Mega Volume', image: null },
  ],
  4: [
    { id: 14, name: 'Hair Wash', image: null },
    { id: 15, name: 'Deep Conditioning', image: null },
    { id: 16, name: 'Scalp Treatment', image: null },
    { id: 17, name: 'Hair Coloring', image: null },
  ],
};

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);

  let service = await prisma.uploadService.findUnique({
    where: { id: numId },
    include: { subcategories: true },
  });

  if (!service) {
    const fallback = fallbackServices.find(s => s.id === numId);
    if (!fallback) {
      notFound();
    }
    return <ServiceDetails service={fallback} subcategories={fallbackSubcategories[numId] || []} />;
  }

  return <ServiceDetails service={service} subcategories={service.subcategories} />;
}
