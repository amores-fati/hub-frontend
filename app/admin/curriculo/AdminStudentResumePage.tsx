'use client';

import { StudentResumePage } from '@/app/aluno/curriculo/StudentResumePage';
import { StudentResume } from '@/dtos/StudentResumeDto';
import { useSearchParams } from 'next/navigation';
import { useGetAdminStudentResume } from '@/services/api/admin/students/resume/queries';
import { useGetStudent } from '@/services/api/students/queries';

const EMPTY_RESUME: StudentResume = {
    id: '',
    about: null,
    linkedinUrl: null,
    githubUrl: null,
    videoPresentationUrl: null,
    photoUrl: null,
    skills: [],
};

export default function AdminStudentResumePage() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    const {
        data: resume,
        isLoading: isLoadingResume,
        isError: isErrorResume,
    } = useGetAdminStudentResume(studentId);
    const {
        data: profile,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
    } = useGetStudent(studentId);

    const isLoading = isLoadingProfile || isLoadingResume;
    const isError = isErrorProfile || isErrorResume || (!isLoading && !profile);

    return (
        <StudentResumePage
            profile={profile!}
            resume={resume ?? EMPTY_RESUME}
            isLoading={isLoading}
            isError={isError}
        />
    );
}
