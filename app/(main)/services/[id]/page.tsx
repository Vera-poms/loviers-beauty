import ServiceDetails from "@/components/Services/ServiceDetails";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const fallbackServices = [
  { id: 1, image: '/assets/3.png', video: null, title: 'Braids', description: 'Professional braiding services', braidingHours: '' },
  { id: 2, image: '/assets/2.png', video: null, title: 'Training', description: 'Hair styling training programs', braidingHours: '' },
  { id: 3, image: '/assets/1.png', video: null, title: 'Lash', description: 'Expert lash extension services', braidingHours: '' },
  { id: 4, image: '/assets/4.png', video: null, title: 'Extras', description: 'Additional beauty services', braidingHours: '' },
];

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
    return <ServiceDetails service={fallback} subcategories={[]} />;
  }

  return <ServiceDetails service={service} subcategories={service.subcategories} />;
}
