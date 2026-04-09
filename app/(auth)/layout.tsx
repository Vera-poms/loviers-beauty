'use client';

import { ErrorMessage } from "@/components/context/errorMessage";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorMessage>
      {children}
    </ErrorMessage>
  );
}