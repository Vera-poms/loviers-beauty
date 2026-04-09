import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') return null;
  return session.user;
}

// GET /api/admin/services/[id] — Get a single service
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

  const service = await prisma.uploadService.findUnique({
    where: { id: serviceId },
    include: { subcategories: true },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json(service);
}

// PUT /api/admin/services/[id] — Update a service
export async function PUT(
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

  const existing = await prisma.uploadService.findUnique({
    where: { id: serviceId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const body = await request.json();
  const { title, description, braidingHours, image, video } = body;

  const service = await prisma.uploadService.update({
    where: { id: serviceId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(braidingHours !== undefined && { braidingHours }),
      ...(image !== undefined && { image }),
      ...(video !== undefined && { video }),
    },
    include: { subcategories: true },
  });

  return NextResponse.json(service);
}

// DELETE /api/admin/services/[id] — Delete a service (cascades to subcategories)
export async function DELETE(
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

  const existing = await prisma.uploadService.findUnique({
    where: { id: serviceId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  await prisma.uploadService.delete({
    where: { id: serviceId },
  });

  return NextResponse.json({ message: 'Service deleted' });
}
