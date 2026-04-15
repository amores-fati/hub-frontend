'use client';
import { Button } from '@/components/base';
import Card from '@/components/base/Card/card';
import { StudentRegisterPayload } from '@/dtos/StudentDto';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import CheckIcon from '@mui/icons-material/Check';
import { CardActions, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import { RegisterStep1, validateFormStep1 } from './RegisterStep1';
import { RegisterStep2, validateFormStep2 } from './RegisterStep2';
import { RegisterStep3, validateFormStep3 } from './RegisterStep3';
import { RegisterStep4, validateFormStep4 } from './RegisterStep4';
import './index.scss';
import { useStudentRegister } from '@/services/api/students/mutations';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/services/auth/login/mutations';
import { toast } from 'react-toastify';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { removeStoreAuthToken } from '@/utils/stores/auth';

export enum StepperSteps {
    STEP1 = 1,
    STEP2 = 2,
    STEP3 = 3,
    STEP4 = 4,
}

const steps = [
    'Dados pessoais',
    'Endereço e experiência',
    'Informações adicionais',
    'Confirmação',
];

export default function CadastroAluno() {
    const router = useRouter();

    const { setAuthToken } = useAuth();

    const [activeStep, setActiveStep] = useState<StepperSteps>(
        StepperSteps.STEP1,
    );
    const [form, setForm] = useState<StudentRegisterPayload>({
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
        // familyIncome: undefined,
        // Ajustar para receber array
        hasWorkExperience: false,
        hasParticipatedOnCourses: false,
        currentlyWorking: false,
        workField: undefined,
        hasAccessability: false,
        typeAccessability: '',
        lgpd: {
            terms: false,
            imageUsage: false,
        },
        peopleInHouse: '',
        socialBenefit: undefined,
    });

    const { mutate, error, data } = useStudentRegister(form);

    const { mutate: login, data: loginData } = useLoginMutation({
        email: form.email ?? '',
        password: form.password ?? '',
    });

    useEffect(() => {
        if (error || !data) return;
        login();
    }, [data]);

    useEffect(() => {
        if (loginData && loginData.accessToken) {
            removeStoreAuthToken();
            setAuthToken(loginData.accessToken, true);
            toast.success('Login realizado com sucesso!');
            router.push('/');
        }
    }, [loginData]);

    const handleNext = () => {
        try {
            switch (activeStep) {
                case StepperSteps.STEP1:
                    validateFormStep1(form);
                    handleForward();
                    return;
                case StepperSteps.STEP2:
                    validateFormStep2(form);
                    handleForward();
                    return;
                case StepperSteps.STEP3:
                    validateFormStep3(form);
                    handleForward();
                    return;
                case StepperSteps.STEP4:
                    validateFormStep4(form);
            }
            mutate();
        } catch {
            return null;
        }
    };

    const handleForward = () => {
        setActiveStep((prevActiveStep) =>
            Math.min(prevActiveStep + 1, StepperSteps.STEP4),
        );
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) =>
            Math.max(prevActiveStep - 1, StepperSteps.STEP1),
        );
    };

    const onForward = () => {
        handleNext();
    };

    const onBack = () => {
        handleBack();
    };

    return (
        <div className='cadastro-aluno-page w-full'>
            <div className='page-title'>
                <h1>Cria a sua conta no</h1>
                <h1 className='page-title__highlight'>Instituto Amores Fati</h1>
            </div>
            <div className='stepper-custom'>
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive =
                        (stepNumber as StepperSteps) === activeStep;
                    const isCompleted =
                        (stepNumber as StepperSteps) < activeStep;

                    return (
                        <div
                            key={label}
                            className={`stepper-custom__step ${isActive ? 'stepper-custom__step--active' : ''} ${isCompleted ? 'stepper-custom__step--completed' : ''}`}
                        >
                            <div className='stepper-custom__indicator'>
                                {isCompleted ? (
                                    <CheckIcon fontSize='small' />
                                ) : (
                                    <span>{stepNumber}</span>
                                )}
                            </div>
                            <span className='stepper-custom__label'>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <Card>
                <CardContent aria-label='content'>
                    {activeStep === StepperSteps.STEP1 && (
                        <RegisterStep1 form={form} setForm={setForm} />
                    )}
                    {activeStep === StepperSteps.STEP2 && (
                        <RegisterStep2 form={form} setForm={setForm} />
                    )}
                    {activeStep === StepperSteps.STEP3 && (
                        <RegisterStep3 form={form} setForm={setForm} />
                    )}
                    {activeStep === StepperSteps.STEP4 && (
                        <RegisterStep4 form={form} setForm={setForm} />
                    )}
                </CardContent>
                <CardActions aria-label='actions'>
                    <Button
                        onClick={onBack}
                        variant='secondary'
                        disabled={activeStep === StepperSteps.STEP1}
                        style={{
                            visibility:
                                activeStep === StepperSteps.STEP1
                                    ? 'hidden'
                                    : 'visible',
                        }}
                    >
                        <ArrowBackSharpIcon color='action' />
                        <span>Voltar</span>
                    </Button>
                    <Button onClick={onForward}>
                        <span>
                            {activeStep === StepperSteps.STEP4
                                ? 'Cadastrar'
                                : 'Avançar'}
                        </span>
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
