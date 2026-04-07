'use client';
import { CardActions, CardContent } from '@mui/material';
import { useState } from 'react';

import { Button } from '@/components/base';
import Card from '@/components/base/Card/card';
import { CompanyRegisterPayload } from '@/dtos/CompanyDto';
import { Form } from './Form';
import './index.scss';

export enum StepperSteps {
    STEP1 = 1,
    STEP2 = 2,
    STEP3 = 3,
    STEP4 = 4,
}

export default function CadastroAluno() {
    const [form, setForm] = useState<CompanyRegisterPayload>({
        name: '',
        cnpj: '',
        phoneNumber: '',
        email: '',
        ownerName: '',
        password: '',
        passwordConfirmation: '',
        cep: '',
        address: undefined,
        complement: undefined,
        neighbourhood: undefined,
        city: undefined,
        state: undefined,
        lgpd: {
            terms: false,
        },
    });

    const onClick = () => {
        window.alert(form)
    }

    return (
        <div className='cadastro-aluno-page w-full'>
            <div className='page-title'>
                <h1>Inclua sua empresa no</h1>
                <h1 className='page-title__highlight'>Instituto Amores Fati</h1>
            </div>

            <Card>
                <CardContent aria-label='content'>
                    <Form form={form} setForm={setForm} />
                </CardContent>
                <CardActions aria-label='actions'>
                    <Button onClick={onClick}>
                        <span>{'Cadastrar'}</span>
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}