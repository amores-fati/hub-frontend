import type { Metadata } from 'next';
import { DM_Sans, Zilla_Slab } from 'next/font/google';

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

const dmSans = DM_Sans({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-dm-sans',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            suppressHydrationWarning
            className={`${zillaSlab.variable} ${dmSans.variable}`}
        >
            <body suppressHydrationWarning className='custom-body antialiased'>
                <Client>{children}</Client>
            </body>
        </html>
    );
}
