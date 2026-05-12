'use client';

import StudentResumePage from '@/app/aluno/curriculo/StudentResumePage';
import { useSearchParams } from 'next/navigation';

export default function AdminStudentResumePage() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    return <StudentResumePage adminStudentId={studentId} />;
}
