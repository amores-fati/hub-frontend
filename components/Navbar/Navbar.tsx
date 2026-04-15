'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../providers/Auth/AuthProvider';
import {
    PAGES,
    NAVIGATION_MAP,
} from '../../providers/Route/PagesConfiguration';
import { UserRole } from '@/dtos/UserDto';
import './index.scss';
import { ButtonComponent } from '../base/Button/button';

import logoImg from '../../assets/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const role = user?.role || UserRole.ADMIN; // Se quiser testar, apenas mudar o valor default de GUEST para ADMIN
    const navItems = NAVIGATION_MAP[role] || [];

    const roleContent =
        (role === UserRole.STUDENT || role === UserRole.COMPANY) && user?.email
            ? user.email
            : role;

    return (
        <nav className='navbar'>
            <div className='navbar__inner'>
                <div className='navbar__left'>
                    {/* Logo */}
                    <Link href='/' className='navbar__logo'>
                        <Image src={logoImg} alt='Amores Fati Logo' />
                        <p className='navbar__logo-text'>Amores Fati</p>
                    </Link>

                    {/* Badge de Role */}
                    <span className='navbar__badge'>{roleContent}</span>

                    <div className='navbar__divider' />

                    {/* Links desktop */}
                    <ul className='navbar__nav'>
                        {navItems.map((item) => {
                            const routeExists = PAGES.some(
                                (p) => p.path === item.expectedPath,
                            );
                            const isActive = pathname === item.expectedPath;
                            const isDisabled = !routeExists;

                            return (
                                <li
                                    key={item.title}
                                    className='navbar__nav-item'
                                >
                                    <ButtonComponent
                                        variant={
                                            isActive ? 'primary' : 'secondary'
                                        }
                                        disabled={isDisabled}
                                        onClick={() => {
                                            if (!isDisabled)
                                                router.push(item.expectedPath);
                                        }}
                                    >
                                        <div className='navbar__nav-button-content'>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </div>
                                    </ButtonComponent>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Ações / Logout */}
                <div className='navbar__right'>
                    <button className='navbar__logout' onClick={logout}>
                        <LogoutIcon />
                        Sair da Conta
                    </button>
                </div>
            </div>
        </nav>
    );
}
