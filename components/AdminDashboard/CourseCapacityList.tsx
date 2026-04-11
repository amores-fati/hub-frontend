'use client';

import { Card, EChart } from '@/components/base';
import type { EChartsOption } from 'echarts';
import { CourseCapacityProps } from './Types';
import { getDashboardChartTheme } from './chartTheme';

export function CourseCapacityList({ data }: CourseCapacityProps) {
    const theme = getDashboardChartTheme();
    const chartColors = [
        theme.tertiary,
        theme.secondary,
        theme.primary,
        theme.info,
    ];

    const option = {
        animationDuration: 500,
        grid: {
            top: 8,
            right: 16,
            bottom: 8,
            left: 16,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            backgroundColor: theme.surface,
            borderColor: theme.grid,
            textStyle: {
                color: theme.textPrimary,
            },
            valueFormatter: (value) =>
                `${Number(Array.isArray(value) ? value[0] : value ?? 0)} alunos`,
        },
        xAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
                color: theme.textSecondary,
            },
            splitLine: {
                lineStyle: {
                    color: theme.grid,
                },
            },
        },
        yAxis: {
            type: 'category',
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                color: theme.textPrimary,
                width: 120,
                overflow: 'truncate',
            },
            data: data.map((item) => `${item.city} - ${item.state}`),
        },
        series: [
            {
                type: 'bar',
                barWidth: 18,
                data: data.map((item, index) => ({
                    value: item.count,
                    itemStyle: {
                        color: chartColors[index % chartColors.length],
                        borderRadius: [0, 999, 999, 0],
                    },
                })),
                showBackground: true,
                backgroundStyle: {
                    color: theme.track,
                    borderRadius: 999,
                },
                label: {
                    show: true,
                    position: 'right',
                    color: theme.textPrimary,
                    formatter: '{c}',
                },
            },
        ],
    } satisfies EChartsOption;

    return (
        <Card>
            <section className='dashboard-panel'>
                <header className='dashboard-panel__header'>
                    <div>
                        <h3>Alunos por Localidade</h3>
                        <p>Distribuição de alunos cadastrados por cidade.</p>
                    </div>
                </header>

                <EChart
                    ariaLabel='Gráfico de alunos cadastrados por localidade'
                    className='dashboard-course-list__canvas'
                    option={option}
                    settings={{ notMerge: true }}
                />
            </section>
        </Card>
    );
}
