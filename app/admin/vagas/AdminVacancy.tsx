'use client';

import './index.scss';

export default function AdminVacancies() {
    return (
        <section className='admin-vacancies'>
            <div className='admin-vacancies__header'>
                <div>
                    <h1>Gestão de Vagas</h1>
                    <p>
                        Administração centralizada de{' '}
                        <a href='#' className='admin-vacancies__subtitle-link'>
                            vagas
                        </a>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
