import Select, { MultiValue, SingleValue } from 'react-select';
import { useAccessibility } from '@/providers/Accessibility/AccessibilityProvider';
import './index.scss';

export type Option = {
    value: string | number;
    label: string;
};

export type SelectProps = {
    isLoading?: boolean;
    onChange?: (newValue: SingleValue<Option>) => void;
    disabled?: boolean;
    placeholder: string;
    defaultValue?: Option;
    value?: Option | null;
    options?: Option[];
    isClearable?: boolean;
    isSearchable?: boolean;
};

export const style = {
    valueContainer: (provided: any) => ({
        ...provided,
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '0.75rem',
    }),
    menu: (provided: any) => ({
        ...provided,
        fontSize: '1rem',
    }),
    control: (provided: any) => ({
        ...provided,
        paddingLeft: '1rem',
        minHeight: '2.0rem',
    }),
    menuPortal: (provided: any) => ({
        ...provided,
        zIndex: 9999,
    }),
};

export const multiStyle = {
    valueContainer: (provided: any) => ({
        ...provided,
        display: 'flex',
        flexWrap: 'wrap' as const,
        maxHeight: '5rem',
        overflow: 'auto',
        gap: '4px',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '0.75rem',
    }),
    menu: (provided: any) => ({
        ...provided,
        fontSize: '1rem',
    }),
    control: (provided: any) => ({
        ...provided,
        paddingLeft: '1rem',
        height: 'auto',
        minHeight: '2.5rem',
    }),
    menuPortal: (provided: any) => ({
        ...provided,
        zIndex: 9999,
    }),
};

export function CustomSelect({
    value,
    defaultValue,
    options,
    onChange,
    disabled,
    placeholder,
    isClearable,
    isSearchable,
    isLoading,
}: SelectProps) {
    const { highContrast } = useAccessibility();

    const resolvedStyle = {
        ...style,
        singleValue: (provided: any) => ({
            ...provided,
            color: highContrast ? '#ffffff' : provided.color,
        }),
    };

    return (
        <Select
            onChange={onChange}
            className='custom-select single-select'
            classNamePrefix='select'
            defaultValue={defaultValue}
            menuPortalTarget={document.body}
            value={value}
            placeholder={placeholder}
            isDisabled={disabled}
            isLoading={!!isLoading}
            isClearable={!!isClearable}
            isSearchable={!!isSearchable}
            options={options}
            noOptionsMessage={() => 'Nenhuma opção disponível'}
            styles={resolvedStyle}
        />
    );
}

export type MultiSelectProps = {
    isLoading?: boolean;
    onChange?: (newValue: MultiValue<Option>) => void;
    disabled?: boolean;
    placeholder: string;
    defaultValue?: Option[];
    value?: Option[];
    options?: Option[];
    isClearable?: boolean;
    isSearchable?: boolean;
};

export function CustomMultSelect({
    value,
    defaultValue,
    options,
    onChange,
    disabled,
    placeholder,
    isClearable,
    isSearchable,
    isLoading,
}: MultiSelectProps) {
    const { highContrast } = useAccessibility();

    const resolvedMultiStyle = {
        ...multiStyle,
        singleValue: (provided: any) => ({
            ...provided,
            color: highContrast ? '#ffffff' : provided.color,
        }),
    };

    return (
        <Select
            closeMenuOnScroll={false}
            menuPortalTarget={document.body}
            closeMenuOnSelect={false}
            onChange={onChange}
            className='custom-select multi-select'
            classNamePrefix='select'
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            isDisabled={disabled}
            isLoading={!!isLoading}
            isClearable={!!isClearable}
            isSearchable={!!isSearchable}
            isMulti={true}
            options={options}
            noOptionsMessage={() => 'Nenhuma opção disponível'}
            styles={resolvedMultiStyle}
        />
    );
}
