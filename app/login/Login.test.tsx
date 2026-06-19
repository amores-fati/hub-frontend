import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';

const navigationMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

const authMocks = vi.hoisted(() => ({
    setAuthToken: vi.fn(),
}));

const loginMutationMocks = vi.hoisted(() => ({
    data: undefined,
    login: vi.fn(),
}));

const passwordResetMocks = vi.hoisted(() => ({
    isPending: false,
    requestPasswordReset: vi.fn(),
}));

const toastMocks = vi.hoisted(() => ({
    error: vi.fn(),
    success: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: navigationMocks.push,
    }),
}));

vi.mock('@/providers/Auth/AuthProvider', () => ({
    useAuth: () => ({
        setAuthToken: authMocks.setAuthToken,
    }),
}));

vi.mock('@/services/auth/login/mutations', () => ({
    useLoginMutation: () => ({
        data: loginMutationMocks.data,
        mutate: loginMutationMocks.login,
    }),
}));

vi.mock('@/services/auth/password-reset/mutations', () => ({
    useForgotPasswordMutation: () => ({
        isPending: passwordResetMocks.isPending,
        mutate: passwordResetMocks.requestPasswordReset,
    }),
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: toastMocks.error,
        success: toastMocks.success,
    },
}));

vi.mock('@mui/icons-material', async () => {
    const { createElement } =
        await vi.importActual<typeof import('react')>('react');
    const MockIcon = () => createElement('span');

    return {
        Visibility: MockIcon,
        VisibilityOff: MockIcon,
    };
});

vi.mock('next/image', async () => {
    const { createElement } =
        await vi.importActual<typeof import('react')>('react');

    return {
        default: ({ alt, src }: { alt: string; src: unknown }) =>
            createElement('img', {
                alt,
                src: typeof src === 'string' ? src : '',
            }),
    };
});

function goToForgotPassword() {
    render(<Login />);
    fireEvent.click(screen.getByText('Esqueci minha senha'));
}

describe('Login password recovery', () => {
    beforeEach(() => {
        navigationMocks.push.mockClear();
        authMocks.setAuthToken.mockClear();
        loginMutationMocks.login.mockClear();
        passwordResetMocks.isPending = false;
        passwordResetMocks.requestPasswordReset.mockClear();
        toastMocks.error.mockClear();
        toastMocks.success.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it('does not request a reset link when the email is invalid', () => {
        goToForgotPassword();

        fireEvent.change(screen.getByPlaceholderText('meu@email.com'), {
            target: { value: 'email-invalido' },
        });
        fireEvent.click(screen.getByText('ENVIAR LINK'));

        expect(toastMocks.error).toHaveBeenCalledWith(
            'Informe um e-mail válido.',
        );
        expect(passwordResetMocks.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('requests a reset link when the email is valid', () => {
        goToForgotPassword();

        fireEvent.change(screen.getByPlaceholderText('meu@email.com'), {
            target: { value: 'usuario@email.com' },
        });
        fireEvent.click(screen.getByText('ENVIAR LINK'));

        expect(passwordResetMocks.requestPasswordReset).toHaveBeenCalledWith(
            { email: 'usuario@email.com' },
            expect.objectContaining({
                onSuccess: expect.any(Function),
            }),
        );
    });
});
