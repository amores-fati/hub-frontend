import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { ChangeEventHandler, useState } from 'react';
import './index.scss';

export type InputProps = {
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
    disabled?: boolean;
    placeholder?: string;
    type?: 'password' | 'text' | 'email' | 'number';
    icon?: React.ReactNode;
    error?: boolean;
    value: string | null;
};

function IconStart({ children }: { children: React.ReactNode }) {
    return <InputAdornment position='start'>{children}</InputAdornment>;
}

function IconEnd({ children }: { children: React.ReactNode }) {
    return <InputAdornment position='end'>{children}</InputAdornment>;
}

export function InputComponent({
    type = 'text',
    placeholder,
    disabled = false,
    onChange,
    icon,
    value,
    error = false
}: InputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isPassword = type === 'password';

    return (
        <TextField
            id='outlined-password-input'
            variant='outlined'
            className='custom-input'
            label={placeholder}
            error={error}
            slotProps={{
                input: {
                    startAdornment: icon && <IconStart>{icon}</IconStart>,
                    endAdornment: isPassword && (
                        <InputAdornment position='end'>
                            <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge='end'
                            >
                                {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            disabled={disabled}
            onChange={onChange}
            type={isPassword && showPassword ? 'text' : type}
            value={value}
        />
    );
}
