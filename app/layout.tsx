import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { FlashProvider } from '@/components/providers/flash-provider';
import { NetworkProvider } from '@/components/providers/network-provider';
import { StoreProvider } from '@/components/providers/store-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Persistify Admin',
  description: 'Persistify Admin app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('persistify-admin-theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <NetworkProvider>
            <StoreProvider>
              <FlashProvider>{children}</FlashProvider>
            </StoreProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
