'use client';

import * as echarts from 'echarts';
import { Card, EChart } from '@/components/base';
import type { EChartsOption } from 'echarts';
import { EnrollmentChartProps } from './Types';
import { getDashboardChartTheme } from './chartTheme';
import { formatMonthLabel } from './Utils';

export function EnrollmentChart({ data }: EnrollmentChartProps) {
    const theme = getDashboardChartTheme();
    const labels = data.map((item) => formatMonthLabel(item.month));
    const values = data.map((item) => item.count);

    const option = {
        animationDuration: 500,
        color: [theme.tertiary],
        grid: {
            top: 16,
            right: 12,
            bottom: 16,
            left: 12,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme.surface,
            borderColor: theme.grid,
            textStyle: {
                color: theme.textPrimary,
            },
            valueFormatter: (value) =>
                `${Number(Array.isArray(value) ? value[0] : (value ?? 0))} alunos`,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: labels,
            axisLine: {
                lineStyle: {
                    color: theme.grid,
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: theme.textSecondary,
            },
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            splitNumber: 4,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: theme.textSecondary,
            },
            splitLine: {
                lineStyle: {
                    color: theme.grid,
                },
            },
        },
        series: [
            {
                type: 'line',
                smooth: true,
                data: values,
                symbol: 'circle',
                symbolSize: 9,
                lineStyle: {
                    width: 4,
                },
                itemStyle: {
                    color: theme.surface,
                    borderColor: theme.tertiary,
                    borderWidth: 3,
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: `${theme.tertiary}61` },
                        { offset: 1, color: `${theme.primary}14` },
                    ]),
                },
            },
        ],
    } satisfies EChartsOption;

    return (
        <Card>
            <section className='dashboard-panel'>
                <header className='dashboard-panel__header'>
                    <div>
                        <h3>Cadastros por Mês</h3>
                        <p>Evolução dos alunos cadastrados na plataforma.</p>
                    </div>
                </header>

                <div className='dashboard-line-chart'>
                    <EChart
                        ariaLabel='Gráfico de cadastros por mês'
                        className='dashboard-line-chart__canvas'
                        option={option}
                        settings={{ notMerge: true }}
                    />

                    <div className='dashboard-line-chart__labels'>
                        {data.map((item) => (
                            <div
                                key={item.month}
                                className='dashboard-line-chart__label'
                            >
                                <span>{formatMonthLabel(item.month)}</span>
                                <strong>{item.count}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Card>
    );
}
