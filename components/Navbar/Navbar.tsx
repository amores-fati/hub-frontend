'use client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../providers/Auth/AuthProvider';
import { PAGES } from '../../providers/Route/pages';
import './index.scss';

function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar__inner">

                {/* Logo */}
                <Link href="/" className="navbar__logo">
                    <span className="navbar__logo-text">
                        Amores<span>Fati</span>
                    </span>
                </Link>

                {/* Links desktop */}
                <ul className="navbar__nav">
                    {PAGES.map((item) => {
                        if (!item.navbarEnabled) return <></>;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`navbar__nav-link${pathname === item.path ? ' navbar__nav-link--active' : ''}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        )
                    })}
                </ul>

                {/* Ações */}
                <div className="navbar__actions">

                    {/* Avatar */}
                    <button className="navbar__avatar" aria-label="Menu do usuário">
                        <div className="navbar__avatar-img">{getInitials(user?.friendlyName || '')}</div>
                        <span className="navbar__avatar-name">{user?.friendlyName}</span>
                        <KeyboardArrowDownIcon />
                    </button>

                    {/* Hamburguer mobile */}
                    <button
                        className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Abrir menu"
                        aria-expanded={mobileOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            <div className={`navbar__mobile-menu${mobileOpen ? '' : ' navbar__mobile-menu--hidden'}`}>
                {PAGES.map((item) => {
                    if (!item.navbarEnabled) return <></>;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`navbar__nav-link${pathname === item.path ? ' navbar__nav-link--active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}
