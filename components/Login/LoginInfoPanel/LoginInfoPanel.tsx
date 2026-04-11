import './index.scss';
import LogoSvg from '@/assets/logo.svg';
import { FeatureCard } from '../FeatureCard';
import Image from 'next/image';

export function LoginInfoPanel() {
    return (
        <div className='login-info'>
            <div className='login-info__header'>
                <div className='login-info__header-text'>
                    <h2 className='login-info__header-title'>
                        <span className='login-info__header-title-line'>
                            Feito para
                        </span>
                        <span className='login-info__header-title-line login-info__header-title-line--accent'>
                            todo
                        </span>
                        <span className='login-info__header-title-line'>
                            tipo de pessoa!
                        </span>
                    </h2>

                    <p className='login-info__subtitle'>
                        Esse site oferece recursos de{' '}
                        <strong>acessibilidade</strong> para que sua{' '}
                        <strong>experiência</strong> seja{' '}
                        <strong>a melhor</strong>, independente de como enxerga,
                        lê ou navega.
                    </p>
                </div>

                <div className='login-info__logo'>
                    <Image src={LogoSvg} alt='Hub Logo' />
                </div>
            </div>

            <div className='login-info__features-grid'>
                <FeatureCard
                    title='Alto Contraste'
                    subtitle='Todas as cores da interface foram pensadas para ter uma alta definição.'
                    color='var(--primary-color)'
                    badgeText='Visual'
                    badgeDarkText={true}
                />
                <FeatureCard
                    title='Navegação Simplificada'
                    subtitle='Menus e opções reorganizados para facilitar o acesso rápido às funções mais usadas.'
                    color='var(--secondary-color)'
                    badgeText='Navegação'
                    badgeDarkText={true}
                />
                <FeatureCard
                    title='Navegação por Teclado'
                    subtitle='Todos os elementos acessíveis com Tab, Enter e atalhos de teclado.'
                    color='var(--tertiary-color)'
                    badgeText='Navegação'
                    badgeDarkText={false}
                />
                <FeatureCard
                    title='Leitor de Tela'
                    subtitle='Compatível com NVDA, JAWS e VoiceOver, com labels e roles ARIA.'
                    color='var(--complement-3)'
                    badgeText='Auditivo'
                    badgeDarkText={false}
                />
            </div>
        </div>
    );
}
