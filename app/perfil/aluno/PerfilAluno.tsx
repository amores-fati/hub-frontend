'use client';
import { Button, Loading } from '@/components/base';
import Card from '@/components/base/Card/card';
import { StudentRegisterPayload } from '@/dtos/StudentDto';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import CheckIcon from '@mui/icons-material/Check';
import { CardActions, CardContent } from '@mui/material';
import { useState } from 'react';
import { RegisterStep1, validateFormStep1 } from '@/app/cadastro/aluno/RegisterStep1';
import { RegisterStep2, validateFormStep2 } from '@/app/cadastro/aluno/RegisterStep2';
import { RegisterStep3, validateFormStep3 } from '@/app/cadastro/aluno/RegisterStep3';
import { RegisterStep4, validateFormStep4 } from '@/app/cadastro/aluno/RegisterStep4';
import './index.scss';
import { useStudentRegister } from '@/services/api/students/mutations';
import { useGetStudent } from '@/services/api/students/queries';
import { DEFAULT_FORM } from '@/app/cadastro/aluno/CadastroAluno';

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

export default function PerfilAluno() {
    const studentId = 1; // TODO: pegar id do aluno logado
    const { data, isLoading } = useGetStudent(studentId);

    // if (isLoading || !data) {
    //     return <Loading />
    // }

    return (
        <CadastroAluno data={data! ?? { ...DEFAULT_FORM }} />
    )
}

function CadastroAluno({ data }: { data: StudentRegisterPayload }) {
    const [activeStep, setActiveStep] = useState<StepperSteps>(
        StepperSteps.STEP1,
    );
    const [form, setForm] = useState<StudentRegisterPayload>({ ...data });

    const { mutate, error } = useStudentRegister(form);

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
                                ? 'Salvar'
                                : 'Avançar'}
                        </span>
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
