// app/providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { ClientLayout } from '@/components/ClientLayout';
import { Toast } from '@/components/base';
import { queryClient } from '@/services/query-client';
import { AuthProvider } from '../providers/Auth/AuthProvider';
import { RouteProvider } from '../providers/Route/RouteProvider';

function QueryClient({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <ClientLayout>{children}</ClientLayout>
        </main>
    );
}

export function Client({ children }: { children: React.ReactNode }) {
    return (
        <React.StrictMode>
            <RouteProvider>
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        <Toast />
                        <QueryClient children={children} />
                    </QueryClientProvider>
                </AuthProvider>
            </RouteProvider>
        </React.StrictMode>
    );
}
