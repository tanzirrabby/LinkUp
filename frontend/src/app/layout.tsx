import './globals.css';
import { ReactNode } from 'react';
import { TopNav } from '../components/layout/TopNav';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
