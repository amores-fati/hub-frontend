'use client';
import { Button } from '@/components/base';
import Card from '@/components/base/Card/card';
import { UserRegisterPayload } from '@/dtos/UserDto';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { Box, CardActions, CardContent, Step, StepLabel, Stepper, } from '@mui/material';
import { useState } from 'react';
import { RegisterStep1, validateFormStep1 } from './RegisterStep1';
import { RegisterStep2, validateFormStep2 } from './RegisterStep2';
import { RegisterStep3, validateFormStep3 } from './RegisterStep3';
import { RegisterStep4, validateFormStep4 } from './RegisterStep4';
import './index.scss';

export enum StepperSteps {
    STEP1 = 1,
    STEP2 = 2,
    STEP3 = 3,
    STEP4 = 4,
}

const steps = ['Dados pessoais', 'Endereço e experiência', 'Informações adicionais', 'Confirmação'];

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

    const handleNext = () => {
        try {
            switch (activeStep) {
                case StepperSteps.STEP1:
                    // validateFormStep1(form);
                    break;
                case StepperSteps.STEP2:
                    // validateFormStep2(form);
                    break;
                case StepperSteps.STEP3:
                    // validateFormStep3(form);
                    break;
                case StepperSteps.STEP4:
                    // validateFormStep4(form);
                    break;
            }
        } catch {
            return null;
        }

        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, StepperSteps.STEP4));
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, StepperSteps.STEP1));
    };

    const onForward = () => {
        handleNext()
        if (activeStep === StepperSteps.STEP4) {
            window.alert(JSON.stringify(form))
        }
    }

    const onBack = () => {
        handleBack()
    }

    return (
        <div className='cadastro-aluno-page w-full'>
            <div className='page-title'>
                <h1>Cria a sua conta no</h1>
                <h1 className='page-title__highlight'>Instituto Amores Fati</h1>
            </div>
            <Box className="stepper-box" sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>

            <Card>
                <CardContent aria-label='content'>
                    {activeStep === StepperSteps.STEP1 && <RegisterStep1 form={form} setForm={setForm} />}
                    {activeStep === StepperSteps.STEP2 && <RegisterStep2 form={form} setForm={setForm} />}
                    {activeStep === StepperSteps.STEP3 && <RegisterStep3 form={form} setForm={setForm} />}
                    {activeStep === StepperSteps.STEP4 && <RegisterStep4 form={form} setForm={setForm} />}
                </CardContent>
                <CardActions aria-label='actions'>
                    <Button
                        onClick={onBack}
                        variant='secondary'
                        disabled={activeStep === StepperSteps.STEP1}
                        style={{ visibility: activeStep === StepperSteps.STEP1 ? 'hidden' : 'visible' }}
                    >
                        <ArrowBackSharpIcon color="action" />
                        <span>Voltar</span>
                    </Button>
                    <Button onClick={onForward}>
                        <span>{activeStep === StepperSteps.STEP4 ? 'Cadastrar' : 'Avançar'}</span>
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
