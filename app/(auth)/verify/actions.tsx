'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function verifyEmailCode(
  _prevState: { error: string } | null,
  formData: FormData) {
  const code = formData.get('code') as string;
  const email = formData.get('email') as string;

  if (!code || !email) {
    return { error: "Verification code and email are required." };
  }


  const { error } = await auth.verifyEmail({
    query: {
      token: code,
      
    }
  } );



  if (error) {
    return { error: error.message || "Invalid or expired code" };
  }

  redirect("/login");
}