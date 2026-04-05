import { Button } from '@mui/material';
import './index.scss';

export type ButtonProps = {
    onClick?: VoidFunction;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
};

export function ButtonComponent({
    onClick,
    disabled = false,
    variant = 'primary',
    children,
}: ButtonProps) {
    return (
        <Button className={`custom-button custom-button--${variant}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={variant}
        >
            {children}
        </Button>
    );
}
