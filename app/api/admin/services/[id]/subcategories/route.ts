import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') return null;
  return session.user;
}

// POST /api/admin/services/[id]/subcategories — Add subcategory to a service
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const serviceId = parseInt(id, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
  }

  const service = await prisma.uploadService.findUnique({
    where: { id: serviceId },
  });
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const body = await request.json();
  const { name, image } = body;

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const subcategory = await prisma.subcategory.create({
    data: {
      name,
      image: image ?? null,
      serviceId,
    },
  });

  return NextResponse.json(subcategory, { status: 201 });
}

// GET /api/admin/services/[id]/subcategories — List subcategories for a service
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const serviceId = parseInt(id, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
  }

  const subcategories = await prisma.subcategory.findMany({
    where: { serviceId },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(subcategories);
}
