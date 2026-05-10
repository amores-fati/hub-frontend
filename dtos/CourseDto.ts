export type CourseDto = {
    id: string;
    title: string;
    description: string;
    modality: 'presencial' | 'online' | 'hibrido';
    workloadHours: number;
    vacancyCount: number;
    startDate: string;
    endDate: string;
    enrollmentStart: string;
    enrollmentEnd: string;
    location: string | null;
    imageUrl: string | null;
    externalLink: string | null;
};

export type EnrollmentDto = {
    courseId: string;
    status: 'enrolled' | 'interested';
    enrolledAt: string;
};

export type PublicSettingDto = {
    key: string;
    value: string;
};
