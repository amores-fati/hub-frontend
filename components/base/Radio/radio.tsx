import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import MuiRadioGroup from '@mui/material/RadioGroup';
import { ChangeEvent } from 'react';
import './index.scss';

export type RadioOption = {
    disabled?: boolean;
    value: string;
    label: string;
};

export default function RadioGroup({
    options,
    onChange,
    value
}: {
    options: RadioOption[];
    onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
    value?: string;
}) {
    return (
        <FormControl>
            <MuiRadioGroup
                row
                onChange={onChange}
                className='custom-radio-group'
            >
                {options.map((option) => {
                    return (
                        <FormControlLabel
                            className='custom-radio-control'
                            key={option.value}
                            value={option.value}
                            checked={value === option.value}
                            control={<Radio className='custom-radio' />}
                            label={option.label}
                            disabled={option.disabled}
                        />
                    );
                })}
            </MuiRadioGroup>
        </FormControl>
    );
}
