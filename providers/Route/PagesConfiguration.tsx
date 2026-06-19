import { UserRole } from '@/dtos/UserDto';
import {
    AssignmentInd as AssignmentIndIcon,
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    HomeFilled,
    MenuBook as MenuBookIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
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
        requireAuth: true,
        requireRoles: [],
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
        path: '/redefinir-senha',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Redefinir Senha',
    },
    {
        path: '/reset-password',
        navbarEnabled: false,
        requireRoles: [],
        requireAuth: false,
        name: 'Redefinir Senha',
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
    {
        path: '/aluno/cursos',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.STUDENT],
        name: 'Cursos',
        icon: <MenuBookIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/alunos',
        navbarEnabled: true,
        requireRoles: [UserRole.ADMIN],
        requireAuth: true,
        name: 'Gestão de Alunos',
        icon: <GroupIcon className='sidebar-icon' />,
    },
    {
        path: '/empresa/vagas',
        navbarEnabled: true,
        requireAuth: false,
        requireRoles: [UserRole.COMPANY],
        name: 'Vagas',
        icon: <WorkIcon className='sidebar-icon' />,
    },
    {
        path: '/empresa/perfil',
        navbarEnabled: true,
        requireAuth: false,
        requireRoles: [],
        name: 'Vagas',
        icon: <WorkIcon className='sidebar-icon' />,
    },
    {
        path: '/aluno/curriculo',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.STUDENT],
        name: 'Gestão de Currículos',
        icon: <AssignmentIndIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/cursos',
        navbarEnabled: true,
        requireRoles: [UserRole.ADMIN],
        requireAuth: true,
        name: 'Gestão de Cursos',
        icon: <GroupIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/curriculos',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.ADMIN],
        name: 'Gestão de Currículos',
        icon: <AssignmentIndIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/curriculo',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.ADMIN],
        name: 'Gestão de Currículos',
        icon: <AssignmentIndIcon className='sidebar-icon' />,
    },

    {
       path: '/admin/configuracoes',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.ADMIN],
        name: 'Configurações',
        icon: <SettingsIcon className='sidebar-icon' />,
    },
    {
        path: '/aluno/perfil',
        navbarEnabled: true,
        requireRoles: [UserRole.STUDENT],
        requireAuth: true,
        name: 'Perfil',
        icon: <PersonIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/empresas',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.ADMIN],
        name: 'Gestão de Empresas',
        icon: <BusinessIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/vagas',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.ADMIN],
        name: 'Gestão de Vagas',
        icon: <WorkIcon className='sidebar-icon' />,
    },
    {
        path: '/admin/configuracoes',
        navbarEnabled: true,
        requireAuth: true,
        requireRoles: [UserRole.ADMIN],
        name: 'Configurações',
        icon: <WorkIcon className='sidebar-icon' />,
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
        { title: 'Alunos', icon: <GroupIcon />, expectedPath: '/admin/alunos' },
        {
            title: 'Cursos',
            icon: <MenuBookIcon />,
            expectedPath: '/admin/cursos',
        },
        {
            title: 'Currículos',
            icon: <AssignmentIndIcon />,
            expectedPath: '/admin/curriculos',
        },
        {
            title: 'Empresas',
            icon: <BusinessIcon />,
            expectedPath: '/admin/empresas',
        },
        { title: 'Vagas', icon: <WorkIcon />, expectedPath: '/admin/vagas' },
        {
            title: 'Configurações',
            icon: <SettingsIcon />,
            expectedPath: '/admin/configuracoes',
        },
    ],
    [UserRole.STUDENT]: [
        {
            title: 'Cursos',
            icon: <MenuBookIcon />,
            expectedPath: '/aluno/cursos',
        },
        {
            title: 'Currículo',
            icon: <AssignmentIndIcon />,
            expectedPath: '/aluno/curriculo',
        },
        {
            title: 'Perfil',
            icon: <PersonIcon />,
            expectedPath: '/aluno/perfil',
        },
    ],
    [UserRole.COMPANY]: [
        { title: 'Home', icon: <HomeFilled />, expectedPath: '/' },
        {
            title: 'Vagas',
            icon: <WorkIcon />,
            expectedPath: '/empresa/vagas',
        },
        {
            title: 'Perfil',
            icon: <PersonIcon />,
            expectedPath: '/empresa/perfil',
        },
    ],
};
