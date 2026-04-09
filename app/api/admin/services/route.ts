import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') return null;
  return session.user;
}

// GET /api/admin/services — List all services
export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = await prisma.uploadService.findMany({
    include: { subcategories: true },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(services);
}

// POST /api/admin/services — Create a new service
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, braidingHours, image, video, subcategories } = body;

  if (!title || !description || !braidingHours) {
    return NextResponse.json(
      { error: 'title, description, and braidingHours are required' },
      { status: 400 }
    );
  }

  const service = await prisma.uploadService.create({
    data: {
      title,
      description,
      braidingHours,
      image: image ?? null,
      video: video ?? null,
      subcategories: subcategories?.length
        ? { create: subcategories.map((sub: { name: string; image?: string }) => ({
            name: sub.name,
            image: sub.image ?? null,
          })) }
        : undefined,
    },
    include: { subcategories: true },
  });

  return NextResponse.json(service, { status: 201 });
}
