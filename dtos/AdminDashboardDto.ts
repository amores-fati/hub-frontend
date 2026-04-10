export type DashboardStatsDto = {
    totalStudents: number;
    totalPcd: number;
    totalActiveVacancies: number;
};

export type EnrollmentByMonthDto = {
    month: string;
    count: number;
};

export type DisabilityType =
    | 'Física'
    | 'Auditiva'
    | 'Visual'
    | 'Intelectual'
    | 'Psicossocial'
    | 'Múltipla'
    | 'Outra';

export type DisabilityDistributionDto = {
    disabilityType: DisabilityType;
    count: number;
};

export type StudentsByCityDto = {
    city: string;
    state: string;
    count: number;
};

export type ImpactEventType = 'placement' | 'course_launch' | 'partnership';

export type ImpactTimelineItemDto = {
    date: string;
    type: ImpactEventType;
    description: string;
};

export type AdminDashboardDto = {
    stats: DashboardStatsDto;
    enrollmentsByMonth: EnrollmentByMonthDto[];
    disabilityDistribution: DisabilityDistributionDto[];
    studentsByCity: StudentsByCityDto[];
    impactTimeline: ImpactTimelineItemDto[];
};
