import type { Metadata } from 'next';


import { Client } from './client';
import './globals.scss';


export const metadata: Metadata = {
    title: 'Amores Fati',
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`custom-body antialiased`}>
                <Client>{children}</Client>
            </body>
        </html>
    );
}
