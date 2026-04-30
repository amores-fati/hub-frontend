import { CourseDto, EnrollmentDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { coursesApi } from '.';
import { getCoursesMock, getEnrollmentsMock } from './mock';

const USE_MOCK_COURSES = true;

const getCourses = async (): Promise<CourseDto[]> => {
    if (USE_MOCK_COURSES) return getCoursesMock();
    return coursesApi.get('').then((res) => res.data as CourseDto[]);
};

const getMyEnrollments = async (): Promise<EnrollmentDto[]> => {
    if (USE_MOCK_COURSES) return getEnrollmentsMock();
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
