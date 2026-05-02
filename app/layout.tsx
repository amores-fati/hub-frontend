import type { Metadata } from 'next';
import { Zilla_Slab } from 'next/font/google';

import '@/scss/globals.scss';
import { Client } from './client';

export const metadata: Metadata = {
    title: 'Amores Fati',
};

const zillaSlab = Zilla_Slab({
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-zilla-next',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning className={zillaSlab.variable}>
            <body suppressHydrationWarning className='custom-body antialiased'>
                <Client>{children}</Client>
            </body>
        </html>
    );
}
