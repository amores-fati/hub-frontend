import { CourseDto, EnrollmentDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { coursesApi } from '.';

const getCourses = async (): Promise<CourseDto[]> => {
    return coursesApi.get('').then((res) => res.data as CourseDto[]);
};

const getMyEnrollments = async (): Promise<EnrollmentDto[]> => {
    return coursesApi
        .get('/me/enrollments')
        .then((res) => res.data as EnrollmentDto[]);
};

export const useGetCourses = () =>
    useQuery({
        queryKey: [QUERY_KEYS.COURSES],
        queryFn: getCourses,
    });

export const useGetMyEnrollments = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ENROLLMENTS],
        queryFn: getMyEnrollments,
    });
