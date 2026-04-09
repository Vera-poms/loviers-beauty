'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function loginWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const { error } = await auth.signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    return { error: error.message || 'Failed to sign in. Try again' };
  }

  const session = await auth.getSession();

  const userRole = session?.data?.user;
  console.log('session user:', userRole);

  if (!userRole || userRole.role === 'USER') {
    return { error: "Access Denied: Only Admins and Owners may log in here." };
  }

  redirect('/');
}