import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppProviders } from '@/app/providers';

export const metadata: Metadata = { title: 'sonic-harness playground (Next)' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
