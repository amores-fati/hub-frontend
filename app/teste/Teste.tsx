'use client';
import { Button, Checkbox, Input, MultSelect, Select } from '@/components/base';
import { ChangeEvent, useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import { Option } from '../../components/base/Select/select';
import './index.scss';

export default function Teste() {
    const [form, setForm] = useState<any>({
        email: '',
        select: null,
        multSelect: [],
        checkbox: false,
    });

    function onSelectChange(newValue: SingleValue<Option>) {
        setForm((prevState: any) => ({
            ...prevState,
            select: newValue,
        }));
    }

    function onMultSelect(newValue: MultiValue<Option>) {
        setForm((prevState: any) => ({
            ...prevState,
            multSelect: newValue,
        }));
    }

    function onInput(newValue: ChangeEvent<HTMLInputElement> | undefined) {
        setForm((prevState: any) => ({
            ...prevState,
            email: newValue?.target?.value,
        }));
    }

    function onCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setForm((prevState: any) => ({
            ...prevState,
            checkbox: event.target.checked,
        }));
    }

    function onClick() {
        window.alert(JSON.stringify(form));
    }

    return (
        <div className='login-page'>
            <p>Teste</p>
            <MultSelect
                options={[
                    { value: 1, label: 'Teste 1' },
                    { value: 2, label: 'Teste 2' },
                ]}
                value={form.multSelect}
                placeholder='Seletor Multiplo Teste'
                onChange={onMultSelect}
            />
            <Select
                options={[
                    { value: 1, label: 'Teste 1' },
                    { value: 2, label: 'Teste 2' },
                ]}
                value={form.select}
                onChange={onSelectChange}
                placeholder='Seletor Teste'
            />
            <Input placeholder='Email' onChange={onInput} value={form.email} />
            <Checkbox checked={form.checkbox} onChange={onCheckboxChange} />
            <Button onClick={onClick} aria-label='primary'>
                <span>Teste</span>
            </Button>
        </div>
    );
}
