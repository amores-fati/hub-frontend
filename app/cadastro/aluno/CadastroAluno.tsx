'use client';
import { Option } from '@/components/base/Select/select';
import { UserRegisterPayload } from '@/dtos/UserDto';
import { CardContent, Step, StepLabel, Stepper } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';

import Card from '@/components/base/Card/card';
import './index.scss';
import { RegisterStep1 } from './RegisterStep1';

export enum StepperSteps {
    STEP1 = 1,
    STEP2 = 2,
    STEP3 = 3,
    STEP4 = 4,
}

export default function CadastroAluno() {
    const [activeStep, setActiveStep] = useState<StepperSteps>(StepperSteps.STEP1);
    const [form, setForm] = useState<UserRegisterPayload>({
        fullName: '',
        socialName: undefined,
        cpf: '',
        birthDate: '',
        phoneNumber: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        gender: undefined,
        race: undefined,
        cep: '',
        address: '',
        complement: undefined,
        neighbourhood: undefined,
        city: undefined,
        state: undefined,
        scholarship: null,
        course: '',
        institution: '',
        whyJoinFatiLab: '',
        whomInformed: undefined,
        hasOwnComputer: false,
        hasInternetAccess: false,
        compromisedToClasses: false,
        familyIncome: undefined,
        hasWorkExperience: false,
        hasParticipatedOnCourses: false,
        currentlyWorking: false,
        workField: undefined,
        hasAccessability: false,
        typeAccessability: '',
        lgpd: {
            terms: false,
            imageUsage: false
        },
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



    return (
        <div className='cadastro-aluno-page w-full'>
            <div className='page-title'>
                <h3>Cria a sua conta no</h3>
                <h3 className='page-title__highlight'>Instituto Amores Fati</h3>
            </div>
            <Stepper activeStep={activeStep} className='stepper'>
                <Step key={StepperSteps.STEP1} active={activeStep === StepperSteps.STEP1}>
                    <StepLabel>1</StepLabel>
                </Step>
                <Step key={StepperSteps.STEP2} active={activeStep === StepperSteps.STEP2}>
                    <StepLabel>2</StepLabel>
                </Step>
            </Stepper>
            <Card>
                <CardContent>
                    {activeStep === StepperSteps.STEP1 && <RegisterStep1 form={form} setForm={setForm} />}
                    {activeStep === StepperSteps.STEP2 && <p>Step 2</p>}
                    {activeStep === StepperSteps.STEP3 && <p>Step 3</p>}
                    {activeStep === StepperSteps.STEP4 && <p>Step 4</p>}
                </CardContent>
            </Card>
        </div>
    );
}
