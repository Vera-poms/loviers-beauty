'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  console.log('email:', email);
  console.log('all formData:', Object.fromEntries(formData));

  if (!email) {
    return { error: "Email address must be provided." }
  }


  const { error } = await auth.signUp.email({
    email,
    name: formData.get('name') as string,
    password: formData.get('password') as string,
    
  });

  console.log('signup error:', error);

  if (error) {
    return { error: error.message || 'Failed to create account' };
  }

  await auth.updateUser({
    role: 'admin' 
  }as any);

  console.log(Object.keys(auth));

  redirect(`/verify?email=${encodeURIComponent(email)}`);
}