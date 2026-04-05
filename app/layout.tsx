import type { Metadata } from 'next';

import '@/scss/globals.scss';
import { Client } from './client';

export const metadata: Metadata = {
    title: 'Amores Fati',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className="custom-body antialiased">
                <Client>{children}</Client>
            </body>
        </html>
    );
}
