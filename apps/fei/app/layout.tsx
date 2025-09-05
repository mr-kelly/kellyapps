import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Daily News Summary Agent',
  description: 'Finance briefing task center demo'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-neutral-200">
        {children}
      </body>
    </html>
  );
}