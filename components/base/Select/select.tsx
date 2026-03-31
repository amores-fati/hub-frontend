
import Select, { SingleValue } from 'react-select';
import './index.scss';

export type Option = {
    value: string | number;
    label: string;
}

export type SelectProps = {
    isLoading?: boolean
    onChange?: (
        newValue: SingleValue<Option>
    ) => void;
    disabled?: boolean;
    placeholder: string;
    defaultValue?: Option;
    value?: Option;
    options?: Option[];
    isClearable?: boolean;
    isSearchable?: boolean;
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
    isLoading
}: SelectProps) {
    return (
        <Select
            onChange={onChange}
            className="custom-single-select"
            classNamePrefix="select"
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            isDisabled={disabled}
            isLoading={!!isLoading}
            isClearable={!!isClearable}
            isSearchable={!!isSearchable}
            options={options}
        />
    );
};
