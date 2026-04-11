import { render, screen } from '@testing-library/react';
import { createElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CourseCapacityList } from './CourseCapacityList';
import { EnrollmentChart } from './EnrollmentChart';
import { StatCard } from './StatCard';
import { StatusDonutChart } from './StatusDonutChart';

const eChartSpy = vi.fn();

vi.mock('@/components/base', async () => {
    const actual = await vi.importActual<typeof import('@/components/base')>(
        '@/components/base',
    );

    return {
        ...actual,
        EChart: (props: {
            ariaLabel?: string;
            className?: string;
            option: unknown;
        }) => {
            eChartSpy(props);

            return createElement('div', {
                'aria-label': props.ariaLabel,
                className: props.className,
                'data-testid': 'echart',
                role: 'img',
            });
        },
    };
});

function renderWithIcon(node: ReactNode) {
    return render(createElement('div', null, node));
}

describe('Admin dashboard components', () => {
    beforeEach(() => {
        eChartSpy.mockClear();
    });

    it('renders stat card content and formats the value in pt-BR', () => {
        renderWithIcon(
            createElement(StatCard, {
                item: {
                    key: 'totalStudents',
                    label: 'Total de alunos',
                    value: 12345,
                    icon: createElement('span', { 'data-testid': 'stat-icon' }, 'I'),
                    accentClassName: 'admin-stat-card--primary',
                    helperText: 'Base cadastrada',
                },
            }),
        );

        expect(screen.getByText('Total de alunos')).toBeInTheDocument();
        expect(screen.getByText('Base cadastrada')).toBeInTheDocument();
        expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
        expect(screen.getByText('12.345')).toBeInTheDocument();
    });

    it('renders the enrollment chart summary and sends the expected series to EChart', () => {
        render(
            createElement(EnrollmentChart, {
                data: [
                    { month: '2025-01', count: 10 },
                    { month: '2025-02', count: 14 },
                ],
            }),
        );

        expect(screen.getByText('Cadastros por Mês')).toBeInTheDocument();
        expect(
            screen.getByText('Evolução dos alunos cadastrados na plataforma.'),
        ).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('14')).toBeInTheDocument();
        expect(
            screen.getByRole('img', { name: 'Gráfico de cadastros por mês' }),
        ).toBeInTheDocument();

        const props = eChartSpy.mock.calls[0][0] as {
            option: {
                series: Array<{ data: number[] }>;
                xAxis: { data: string[] };
            };
        };

        expect(props.option.series[0].data).toEqual([10, 14]);
        expect(props.option.xAxis.data).toHaveLength(2);
    });

    it('renders the status donut chart totals and legend percentages', () => {
        render(
            createElement(StatusDonutChart, {
                data: [
                    { disabilityType: 'Física', count: 30 },
                    { disabilityType: 'Auditiva', count: 20 },
                ],
            }),
        );

        expect(screen.getByText('Tipos de Deficiência')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('Física')).toBeInTheDocument();
        expect(screen.getByText('Auditiva')).toBeInTheDocument();
        expect(screen.getByText('60%')).toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
        expect(
            screen.getByRole('img', {
                name: 'Gráfico de distribuição por tipos de deficiência',
            }),
        ).toBeInTheDocument();

        const props = eChartSpy.mock.calls[0][0] as {
            option: {
                series: Array<{
                    data: Array<{ name: string; value: number }>;
                }>;
            };
        };

        expect(props.option.series[0].data).toEqual([
            { name: 'Física', value: 30 },
            { name: 'Auditiva', value: 20 },
        ]);
    });

    it('renders the locality chart and forwards the city distribution data', () => {
        render(
            createElement(CourseCapacityList, {
                data: [
                    { city: 'Porto Alegre', state: 'RS', count: 12 },
                    { city: 'Canoas', state: 'RS', count: 8 },
                ],
            }),
        );

        expect(screen.getByText('Alunos por Localidade')).toBeInTheDocument();
        expect(
            screen.getByText('Distribuição de alunos cadastrados por cidade.'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('img', {
                name: 'Gráfico de alunos cadastrados por localidade',
            }),
        ).toBeInTheDocument();

        const props = eChartSpy.mock.calls[0][0] as {
            option: {
                yAxis: { data: string[] };
                series: Array<{
                    data: Array<{ value: number }>;
                }>;
            };
        };

        expect(props.option.yAxis.data).toEqual([
            'Porto Alegre - RS',
            'Canoas - RS',
        ]);
        expect(props.option.series[0].data).toEqual([
            expect.objectContaining({ value: 12 }),
            expect.objectContaining({ value: 8 }),
        ]);
    });
});
