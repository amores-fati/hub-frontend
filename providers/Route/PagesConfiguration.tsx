import { UserRole } from '@/dtos/UserDto';
import { HomeFilled } from '@mui/icons-material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import React, { JSX } from 'react';

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
        // requireRoles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.COMPANY],
        // requireAuth: true,
        requireRoles: [],
        requireAuth: false,
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
    {
        path: '/cadastro/aluno',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Cadastro Aluno',
    },
    {
        path: '/cadastro/empresa',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Cadastro Empresa',
    },
];

export type NavItem = {
    title: string;
    icon: React.ReactNode;
    expectedPath: string;
};

export const NAVIGATION_MAP: Record<string, NavItem[]> = {
    [UserRole.ADMIN]: [
        { title: 'Dashboard', icon: <DashboardIcon />, expectedPath: '/' },
        { title: 'Alunos', icon: <GroupIcon />, expectedPath: '/alunos' },
        { title: 'Cursos', icon: <MenuBookIcon />, expectedPath: '/cursos' },
        {
            title: 'Currículos',
            icon: <AssignmentIndIcon />,
            expectedPath: '/curriculos',
        },
    ],
    [UserRole.STUDENT]: [
        { title: 'Cursos', icon: <MenuBookIcon />, expectedPath: '/cursos' },
        {
            title: 'Currículo',
            icon: <AssignmentIndIcon />,
            expectedPath: '/curriculo',
        },
        { title: 'Perfil', icon: <PersonIcon />, expectedPath: '/perfil' },
    ],
    [UserRole.COMPANY]: [
        { title: 'Vagas', icon: <WorkIcon />, expectedPath: '/vagas' },
        { title: 'Perfil', icon: <PersonIcon />, expectedPath: '/perfil' },
    ],
};
