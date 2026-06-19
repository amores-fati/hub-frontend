import { Suspense } from 'react';
import RedefinirSenha from './RedefinirSenha';

export default function RedefinirSenhaPage() {
    return (
        <Suspense fallback={null}>
            <RedefinirSenha />
        </Suspense>
    );
}
