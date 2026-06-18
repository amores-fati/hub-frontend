import { Suspense } from 'react';
import RedefinirSenha from '../redefinir-senha/RedefinirSenha';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <RedefinirSenha />
        </Suspense>
    );
}
