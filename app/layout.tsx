import '@/app/ui/global.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Metadata } from 'next';
import { inter } from './ui/fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | Reservation Dashboard',
    default: 'Reservation Dashboard',
  },
  description: 'Online Reservation System',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
