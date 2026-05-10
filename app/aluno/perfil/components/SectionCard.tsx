import React from 'react';

type SectionCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

export function SectionCard({ icon, title, children }: SectionCardProps) {
    return (
        <section className='perfil-section'>
            <header className='perfil-section__header'>
                <span className='perfil-section__icon'>{icon}</span>
                <h2 className='perfil-section__title'>{title}</h2>
            </header>
            <div className='perfil-section__body'>{children}</div>
        </section>
    );
}
