import Select, { MultiValue } from 'react-select';
import './index.scss';

export type Option = {
    value: string | number;
    label: string;
};

export type SelectProps = {
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
}: SelectProps) {
    return (
        <Select
            closeMenuOnScroll={false}
            closeMenuOnSelect={false}
            onChange={onChange}
            className='custom-mult-select'
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
        />
    );
}
