'use client';

import { Card, EChart } from '@/components/base';
import type { EChartsOption } from 'echarts';
import { getDashboardChartTheme } from './chartTheme';
import { StatusChartProps } from './Types';
import { formatPercentage } from './Utils';

export function StatusDonutChart({ data }: StatusChartProps) {
    const total = data.reduce((acc, item) => acc + item.count, 0);
    const theme = getDashboardChartTheme();
    const statusColors = [
        theme.primary,
        theme.tertiary,
        theme.secondary,
        theme.info,
    ];

    const option = {
        animationDuration: 500,
        color: statusColors,
        tooltip: {
            trigger: 'item',
            confine: true,
            backgroundColor: theme.surface,
            borderColor: theme.grid,
            textStyle: {
                color: theme.textPrimary,
            },
            formatter: '{b}: {c} alunos ({d}%)',
        },
        series: [
            {
                type: 'pie',
                radius: ['62%', '82%'],
                center: ['46%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                itemStyle: {
                    borderColor: theme.surface,
                    borderWidth: 4,
                },
                data: data.map((item) => ({
                    name: item.disabilityType,
                    value: item.count,
                })),
            },
        ],
    } satisfies EChartsOption;

    return (
        <Card>
            <section className='dashboard-panel'>
                <header className='dashboard-panel__header'>
                    <div>
                        <h3>Tipos de Deficiência</h3>
                        <p>
                            Quantidade de alunos por tipo de deficiência
                            registrada.
                        </p>
                    </div>
                </header>

                <div className='dashboard-status-chart'>
                    <div className='dashboard-status-chart__visual'>
                        <EChart
                            ariaLabel='Gráfico de distribuição por tipos de deficiência'
                            className='dashboard-status-chart__canvas'
                            option={option}
                            settings={{ notMerge: true }}
                        />

                        <div className='dashboard-status-chart__center'>
                            <strong>{total}</strong>
                            <span>alunos</span>
                        </div>
                    </div>

                    <div className='dashboard-status-chart__legend'>
                        {data.map((item, index) => {
                            const percentage =
                                (item.count / Math.max(total, 1)) * 100;

                            return (
                                <div
                                    key={item.disabilityType}
                                    className='dashboard-status-chart__legend-item'
                                >
                                    <div className='dashboard-status-chart__legend-main'>
                                        <span
                                            className='dashboard-status-chart__bullet'
                                            style={{
                                                backgroundColor:
                                                    statusColors[
                                                        index %
                                                            statusColors.length
                                                    ],
                                            }}
                                        />
                                        <span>{item.disabilityType}</span>
                                    </div>
                                    <div className='dashboard-status-chart__legend-values'>
                                        <strong>{item.count}</strong>
                                        <span>
                                            {formatPercentage(percentage)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </Card>
    );
}
