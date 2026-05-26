import { Suspense } from 'react';
import AdminStudentResumePage from './AdminStudentResumePage';

export default function CurriculoAdminPage() {
    return (
        <Suspense>
            <AdminStudentResumePage />
        </Suspense>
    );
}
