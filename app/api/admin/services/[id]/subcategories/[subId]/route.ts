import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') return null;
  return session.user;
}

// PUT /api/admin/services/[id]/subcategories/[subId] — Update a subcategory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subId: string }> }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, subId } = await params;
  const serviceId = parseInt(id, 10);
  const subcategoryId = parseInt(subId, 10);
  if (isNaN(serviceId) || isNaN(subcategoryId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const existing = await prisma.subcategory.findFirst({
    where: { id: subcategoryId, serviceId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
  }

  const body = await request.json();
  const { name, image } = body;

  const subcategory = await prisma.subcategory.update({
    where: { id: subcategoryId },
    data: {
      ...(name !== undefined && { name }),
      ...(image !== undefined && { image }),
    },
  });

  return NextResponse.json(subcategory);
}

// DELETE /api/admin/services/[id]/subcategories/[subId] — Delete a subcategory
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; subId: string }> }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, subId } = await params;
  const serviceId = parseInt(id, 10);
  const subcategoryId = parseInt(subId, 10);
  if (isNaN(serviceId) || isNaN(subcategoryId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const existing = await prisma.subcategory.findFirst({
    where: { id: subcategoryId, serviceId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
  }

  await prisma.subcategory.delete({
    where: { id: subcategoryId },
  });

  return NextResponse.json({ message: 'Subcategory deleted' });
}
