import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { montserrat } from './font';
import { authClient } from '@/lib/auth/client'; 
import { NeonAuthUIProvider } from '@neondatabase/auth/react';



export const metadata: Metadata = {
  title: "Loviers Beauty / LashnMore",
  description: "Beauty care booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` antialiased
          ${montserrat.variable}  ${montserrat.className} `}
        suppressHydrationWarning
      >
        <NeonAuthUIProvider
        authClient={authClient as any} 
        redirectTo="/account/settings"
        emailOTP
        >
          <Provider>
              {children}
          </Provider>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
