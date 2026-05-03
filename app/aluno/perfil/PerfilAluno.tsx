'use client';
import { Button, Loading } from '@/components/base';
import Card from '@/components/base/Card/card';
import { Gender, Race, Scholarship, SocialBenefit, StudentRegisterPayload, WhoInformed } from '@/dtos/StudentDto';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import CheckIcon from '@mui/icons-material/Check';
import { CardActions, CardContent } from '@mui/material';
import { useState } from 'react';
import {
    RegisterStep1,
    validateFormStep1,
} from '@/app/cadastro/aluno/RegisterStep1';
import {
    RegisterStep2,
    validateFormStep2,
} from '@/app/cadastro/aluno/RegisterStep2';
import {
    RegisterStep4,
    validateFormStep4,
} from '@/app/cadastro/aluno/RegisterStep4';
import './index.scss';
import { useStudentRegister, useUpdateFullStudentProfile, useUpdateStudentProfile } from '@/services/api/students/mutations';
import { useGetStudentProfile } from '@/services/api/students/queries';
import { DEFAULT_FORM } from '@/app/cadastro/aluno/CadastroAluno';
import { StudentProfile } from '../../../dtos/StudentProfileDto';

export enum StepperSteps {
    STEP1 = 1,
    STEP2 = 2,
    STEP3 = 3,
}

const steps = [
    'Dados pessoais',
    'Endereço e experiência',
    'Confirmação',
];

const studentProfileToPayload = (data: StudentProfile): StudentRegisterPayload & { id: string } => {
    const { contact, disability, ...rest } = data;

    return {
        ...rest,
        birthDate: (data.birthDate.split('T')[0]).split('-').reverse().join('/'),
        phoneNumber: contact.phone,
        cep: contact.cep!,
        address: contact.address!,
        complement: contact.complement,
        neighbourhood: contact.neighbourhood,
        city: contact.city,
        state: contact.state,
        password: DEFAULT_FORM.password,
        passwordConfirmation: DEFAULT_FORM.password,
        scholarship: rest.education,
        whyJoinFatiLab: rest.motivation,
        hasAccessability: disability?.hasDisability || false,
        currentlyWorking: rest.activityArea ? true : false,
        typeAccessability: `${disability?.type!}`.toUpperCase(),
        compromisedToClasses: rest.committedToParticipate,
        workField: rest.activityArea,
        hasOwnComputer: rest.hasComputer,
        hasInternetAccess: rest.hasInternet,
        whomInformed: rest.howHeard,
        socialBenefit: rest.benefit,
        peopleInHouse: rest.householdSize,
        hasWorkExperience: rest.hasProgrammingExperience,
        // TODO Inserir campo no banco
        hasParticipatedOnCourses: false,
        lgpd: {
            terms: true,
            imageUsage: true,
        }
    };
}

const payloadToStudentProfile = (
    payload: StudentRegisterPayload & { id: string },
): StudentProfile => {
    const {
        id,
        fullName,
        socialName,
        cpf,
        birthDate,
        phoneNumber,
        email,
        gender,
        race,
        cep,
        address,
        complement,
        neighbourhood,
        city,
        state,
        scholarship,
        institution,
        whyJoinFatiLab,
        whomInformed,
        hasOwnComputer,
        hasInternetAccess,
        compromisedToClasses,
        peopleInHouse,
        socialBenefit,
        hasWorkExperience,
        workField,
        hasAccessability,
        typeAccessability,
    } = payload;

    return {
        id,
        fullName: fullName ?? '',
        socialName,
        email: email ?? '',
        cpf: cpf ?? '',
        // "DD/MM/YYYY" → "YYYY-MM-DD"
        birthDate: birthDate
            ? birthDate.split('/').reverse().join('-')
            : '',
        gender: gender as Gender,
        race: race as Race,
        education: scholarship as Scholarship,
        institution,
        activityArea: workField,
        motivation: whyJoinFatiLab,
        howHeard: whomInformed as WhoInformed,
        benefit: socialBenefit as SocialBenefit,
        householdSize: peopleInHouse ?? '',
        committedToParticipate: compromisedToClasses ?? false,
        hasProgrammingExperience: hasWorkExperience ?? false,
        hasInternet: hasInternetAccess ?? false,
        hasComputer: hasOwnComputer ?? false,
        contact: {
            id,
            phone: phoneNumber ?? '',
            cep,
            address,
            complement,
            neighbourhood,
            city,
            state,
        },
        disability: {
            studentId: id,
            hasDisability: hasAccessability,
            type: typeAccessability,
        },
    };
};

export default function PerfilAluno() {
    const { data, isLoading } = useGetStudentProfile();

    if (isLoading || !data) {
        return <Loading />
    }

    return <CadastroAluno data={studentProfileToPayload(data)} />;
}

function CadastroAluno({ data }: { data: StudentRegisterPayload & { id: string } }) {
    const [activeStep, setActiveStep] = useState<StepperSteps>(
        StepperSteps.STEP1,
    );
    const [form, setForm] = useState<StudentRegisterPayload>({ ...data });

    const { mutate, error } = useUpdateStudentProfile();

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
                    validateFormStep4(form);
            }
            mutate(payloadToStudentProfile({ ...form, id: data.id }));
        } catch {
            return null;
        }
    };

    const handleForward = () => {
        setActiveStep((prevActiveStep) =>
            Math.min(prevActiveStep + 1, StepperSteps.STEP3),
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
                        <RegisterStep4 form={form} setForm={setForm} editing={true} />
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
                            {activeStep === StepperSteps.STEP3
                                ? 'Salvar'
                                : 'Avançar'}
                        </span>
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
