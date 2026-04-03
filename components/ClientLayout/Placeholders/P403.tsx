'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import './index.scss';

interface P403Props {
    resourceName?: string;
    onGoBack?: () => void;
}

export default function P403({ resourceName, onGoBack }: P403Props) {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles: {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
        }[] = [];

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.3 + 0.05,
            });
        }

        let animId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 80, 60, ${p.opacity})`;
                ctx.fill();
            });

            // Draw faint lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(220, 80, 60, ${0.06 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => cancelAnimationFrame(animId);
    }, []);

    const handleBack = () => {
        if (onGoBack) {
            onGoBack();
        } else {
            router.back();
        }
    };

    return (
        <div className='p403-container'>
            <canvas ref={canvasRef} className='p403-canvas' />

            <div className='p403-content'>
                <div className='p403-icon-wrap'>
                    <div className='p403-icon-ring' />
                    <div className='p403-icon-ring p403-icon-ring--2' />
                    <svg
                        className='p403-icon'
                        viewBox='0 0 48 48'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <rect
                            x='10'
                            y='22'
                            width='28'
                            height='20'
                            rx='3'
                            stroke='currentColor'
                            strokeWidth='2'
                        />
                        <path
                            d='M16 22V16a8 8 0 0 1 16 0v6'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                        />
                        <circle cx='24' cy='32' r='3' fill='currentColor' />
                        <line
                            x1='24'
                            y1='35'
                            x2='24'
                            y2='39'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                        />
                    </svg>
                </div>

                <div className='p403-code'>403</div>

                <h1 className='p403-title'>Acesso Negado</h1>

                <p className='p403-description'>
                    {resourceName ? (
                        <>
                            Você não tem permissão para acessar{' '}
                            <span className='p403-resource'>
                                {resourceName}
                            </span>
                            .
                        </>
                    ) : (
                        'Você não tem as permissões necessárias para visualizar este recurso.'
                    )}
                </p>

                <div className='p403-divider'>
                    <span />
                    <small>O que você pode fazer</small>
                    <span />
                </div>

                <ul className='p403-tips'>
                    <li>Verifique se você está logado com a conta correta</li>
                    <li>Solicite acesso ao administrador do sistema</li>
                    <li>Volte para uma página que você tem permissão</li>
                </ul>

                <div className='p403-actions'>
                    <button
                        className='p403-btn p403-btn--ghost'
                        onClick={handleBack}
                    >
                        <svg viewBox='0 0 20 20' fill='none'>
                            <path
                                d='M13 4L7 10l6 6'
                                stroke='currentColor'
                                strokeWidth='1.8'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                        Voltar
                    </button>
                    <button
                        className='p403-btn p403-btn--primary'
                        onClick={() => router.push('/')}
                    >
                        Ir para início
                    </button>
                </div>
            </div>
        </div>
    );
}
