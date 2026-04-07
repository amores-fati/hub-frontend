import Select, { MultiValue, SingleValue } from 'react-select';
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
    value?: Option;
    options?: Option[];
    isClearable?: boolean;
    isSearchable?: boolean;
};

export const style = {
    valueContainer: (provided: any) => ({
        ...provided,
        maxHeight: '2rem',
        overflow: 'auto',
        padding: '1 1',
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
            styles={style}
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
            styles={style}
        />
    );
}
