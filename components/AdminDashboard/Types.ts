import {
    DisabilityDistributionDto,
    DashboardStatsDto,
    EnrollmentByMonthDto,
    ImpactTimelineItemDto,
    StudentsByCityDto,
} from '@/dtos/AdminDashboardDto';
import { ReactNode } from 'react';

export type StatCardItem = {
    key: keyof DashboardStatsDto;
    label: string;
    value: number;
    icon: ReactNode;
    accentClassName: string;
    helperText: string;
};

export type EnrollmentChartProps = {
    data: EnrollmentByMonthDto[];
};

export type StatusChartProps = {
    data: DisabilityDistributionDto[];
};

export type CourseCapacityProps = {
    data: StudentsByCityDto[];
};

export type ImpactTimelineProps = {
    data: ImpactTimelineItemDto[];
};
