import { UserRole } from '@/dtos/UserDto';
import { DashboardRounded } from '@mui/icons-material';
import { JSX } from 'react';

export type Page = {
    path: string;
    navbarEnabled: boolean;
    requireRoles: UserRole[];
    requireAuth: boolean;
    name: string;
    icon?: JSX.Element;
    topbarDisabled?: boolean;
};

export const PAGES: Page[] = [
    {
        path: '/',
        navbarEnabled: true,
        requireRoles: [],
        requireAuth: false,
        name: 'Dashboard',
        icon: <DashboardRounded className='sidebar-icon' />,
    },
    {
        path: '/login',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Login',
    },
    {
        path: '/teste',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Login',
    },
    {
        path: '/cadastro/aluno',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Login',
    },
];
