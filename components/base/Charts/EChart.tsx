'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsInitOpts, EChartsOption, SetOptionOpts } from 'echarts';

type EChartProps = {
    ariaLabel?: string;
    className?: string;
    option: EChartsOption;
    opts?: EChartsInitOpts;
    settings?: SetOptionOpts;
};

export function EChart({
    ariaLabel,
    className,
    option,
    opts,
    settings,
}: EChartProps) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        const chart = echarts.init(chartRef.current, undefined, opts);
        instanceRef.current = chart;

        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });

        resizeObserver.observe(chartRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.dispose();
            instanceRef.current = null;
        };
    }, [opts]);

    useEffect(() => {
        instanceRef.current?.setOption(option, settings);
    }, [option, settings]);

    return (
        <div
            ref={chartRef}
            aria-label={ariaLabel}
            className={className}
            role='img'
        />
    );
}
