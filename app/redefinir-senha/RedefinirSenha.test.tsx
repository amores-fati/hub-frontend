import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RedefinirSenha from './RedefinirSenha';

const navigationMocks = vi.hoisted(() => ({
    push: vi.fn(),
    searchParams: new URLSearchParams('token=abc123'),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: navigationMocks.push,
    }),
    useSearchParams: () => navigationMocks.searchParams,
}));

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

function renderResetPasswordPage(query = 'token=abc123') {
    navigationMocks.searchParams = new URLSearchParams(query);
    return render(<RedefinirSenha />);
}

function getSubmitButton() {
    return screen.getByText('DEFINIR').closest('button');
}

function fillPasswordFields(newPassword: string, passwordConfirmation: string) {
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
        target: { value: newPassword },
    });
    fireEvent.change(
        screen.getByPlaceholderText('As senhas devem ser as mesmas'),
        {
            target: { value: passwordConfirmation },
        },
    );
}

describe('RedefinirSenha', () => {
    beforeEach(() => {
        navigationMocks.push.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the info panel, reset password form and submit button', () => {
        renderResetPasswordPage();

        expect(screen.getByText('Feito para')).toBeInTheDocument();
        expect(screen.getByText('Definir nova senha:')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Mínimo 8 caracteres'),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('As senhas devem ser as mesmas'),
        ).toBeInTheDocument();
        expect(screen.getByText('DEFINIR')).toBeInTheDocument();
    });

    it('shows an invalid link message when token is missing', () => {
        renderResetPasswordPage('');

        expect(screen.getByText('Link inválido')).toBeInTheDocument();
        expect(screen.getByText('Voltar ao login')).toBeInTheDocument();
    });

    it('goes back to login from the invalid link state', () => {
        renderResetPasswordPage('');

        fireEvent.click(screen.getByText('Voltar ao login'));

        expect(navigationMocks.push).toHaveBeenCalledWith('/login');
    });

    it('shows a minimum length error after password blur', () => {
        renderResetPasswordPage();

        const passwordInput = screen.getByPlaceholderText(
            'Mínimo 8 caracteres',
        );
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.blur(passwordInput);

        expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument();
    });

    it('shows an error when passwords do not match after confirmation blur', () => {
        renderResetPasswordPage();

        fillPasswordFields('senha12345', 'senha54321');
        fireEvent.blur(
            screen.getByPlaceholderText('As senhas devem ser as mesmas'),
        );

        expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });

    it('keeps the submit button disabled while fields are invalid', () => {
        renderResetPasswordPage();

        fillPasswordFields('123456', '123456');

        expect(getSubmitButton()).toBeDisabled();
    });

    it('enables the submit button when passwords are valid and match', () => {
        renderResetPasswordPage();

        fillPasswordFields('senhaValida123', 'senhaValida123');
        fireEvent.blur(screen.getByPlaceholderText('Mínimo 8 caracteres'));
        fireEvent.blur(
            screen.getByPlaceholderText('As senhas devem ser as mesmas'),
        );

        expect(getSubmitButton()).toBeEnabled();
    });

    it('toggles password visibility from the eye icon', () => {
        renderResetPasswordPage();

        const passwordInput = screen.getByPlaceholderText(
            'Mínimo 8 caracteres',
        ) as HTMLInputElement;
        const passwordField = passwordInput.closest('.MuiFormControl-root');

        expect(passwordInput.type).toBe('password');

        fireEvent.click(
            within(passwordField as HTMLElement).getByRole('button'),
        );
        expect(passwordInput.type).toBe('text');

        fireEvent.click(
            within(passwordField as HTMLElement).getByRole('button'),
        );
        expect(passwordInput.type).toBe('password');
    });

    it('logs the reset password payload on submit', () => {
        const consoleSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => undefined);
        renderResetPasswordPage();

        fillPasswordFields('senhaValida123', 'senhaValida123');
        fireEvent.click(screen.getByText('DEFINIR'));

        expect(consoleSpy).toHaveBeenCalledWith({
            token: 'abc123',
            newPassword: 'senhaValida123',
        });
    });
});
