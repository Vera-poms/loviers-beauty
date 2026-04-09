'use client';

import Navbar from "@/components/Navbar/Navbar";
import { Stack } from "@chakra-ui/react";
import { ErrorMessage } from "@/components/context/errorMessage";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorMessage>
      <Navbar />
      <Stack position="relative" zIndex="10">
        {children} 
      </Stack>
    </ErrorMessage>
  );
}