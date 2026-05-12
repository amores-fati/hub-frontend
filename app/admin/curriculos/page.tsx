import { Suspense } from 'react';
import AdminStudentResumePage from './AdminStudentResumePage';

export default function CurriculosAdminPage() {
    return (
        <Suspense>
            <AdminStudentResumePage />
        </Suspense>
    );
}
