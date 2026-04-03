import { UserRole } from '@/dtos/UserDto';
import { HomeFilled } from '@mui/icons-material';
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
        requireRoles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.COMPANY],
        requireAuth: true,
        name: 'Home',
        icon: <HomeFilled className='sidebar-icon' />,
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
];
