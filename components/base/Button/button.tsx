import { Button } from '@mui/material';
import './index.scss';

export type ButtonProps = {
    onClick?: VoidFunction;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    className?: string;
    style?: object;
};

export function ButtonComponent({
    onClick,
    disabled = false,
    variant = 'primary',
    className = "",
    children,
    style = {}
}: ButtonProps) {
    return (
        <Button
            style={style}
            className={`custom-button custom-button--${variant}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={variant}
        >
            {children}
        </Button>
    );
}
