import { Input, RadioGroup } from '@/components/base';
import {
    FamilyIncome,
    SocialBenefit,
    UserRegisterPayload,
    WhoInformed,
} from '@/dtos/UserDto';
import { integerRegex } from '@/utils/regex';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { InputAdornment } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { toast } from 'react-toastify';

const WhoInformedFromRadioOptions = [
    {
        label: 'Instagram',
        value: WhoInformed.INSTAGRAM,
    },
    {
        label: 'Indicação',
        value: WhoInformed.REFEREE,
    },
    {
        label: 'Linkedin',
        value: WhoInformed.LINKEDIN,
    },
    {
        label: 'Outros',
        value: WhoInformed.OTHERS,
    },
];

const yesNoOptions = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
];

const familyIncomeOptions = [
    { label: 'Até 1 salário mínimo', value: FamilyIncome.TO1_SALARY },
    { label: '1 a 3 salários mínimos', value: FamilyIncome.BETWEEN_1_3 },
    { label: 'Mais de 3 salários', value: FamilyIncome.MORE_THAN_3 },
];

const socialBenefitOptions = [
    { label: 'Bolsa Família', value: SocialBenefit.BOLSA_FAMILIA },
    { label: 'BPC', value: SocialBenefit.BPC },
    { label: 'Nenhum', value: SocialBenefit.NONE },
    { label: 'Outros', value: SocialBenefit.OTHERS },
];

export function RegisterStep3({
    form,
    setForm,
}: {
    form: UserRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>;
}) {
    function onWhyJoinFatiLabChange(newValue: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            whyJoinFatiLab: newValue.target.value,
        }));
    }

    function onWhoInformedChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prevState: UserRegisterPayload) => ({
            ...prevState,
            whomInformed: value as WhoInformed,
        }));
    }

    function onOwnComputerChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prev: UserRegisterPayload) => ({
            ...prev,
            hasOwnComputer: value === 'true',
        }));
    }

    function onInternetAccessChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prev: UserRegisterPayload) => ({
            ...prev,
            hasInternetAccess: value === 'true',
        }));
    }

    function onCompromisedToClassesChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prev: UserRegisterPayload) => ({
            ...prev,
            compromisedToClasses: value === 'true',
        }));
    }

    function onFamilyIncomeChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prev: UserRegisterPayload) => ({
            ...prev,
            familyIncome: value as FamilyIncome,
        }));
    }

    function onPeopleInHouseChange(newValue: ChangeEvent<HTMLInputElement>) {
        setForm((prev: UserRegisterPayload) => ({
            ...prev,
            peopleInHouse: integerRegex(newValue?.target?.value ?? null) ?? '',
        }));
    }

    function onSocialBenefitChange(
        _: ChangeEvent<HTMLInputElement> | undefined,
        value: string,
    ) {
        setForm((prev) => ({ ...prev, socialBenefit: value as SocialBenefit }));
    }

    return (
        <div className='register-steps'>
            {/*Seção fatiLab*/}
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <InfoOutlinedIcon />
                </InputAdornment>
                <span>Sobre o FatiLab</span>
            </div>

            {/*Seção Por que fatiLab*/}
            <div className='register-steps__grid'>
                <div className='register-steps__field'>
                    <p className='field-label'>
                        {' '}
                        Por que você quer participar do FatiLab?{' '}
                        <span className='required'>*</span>{' '}
                    </p>
                    <Input
                        placeholder='Conte-nos um pouco da sua motivação...'
                        onChange={onWhyJoinFatiLabChange}
                        value={form.whyJoinFatiLab}
                    />
                </div>
            </div>

            {/* Seção Como ficou sabendo */}
            <div className='register-steps__field'>
                <p className='field-label'>Como ficou sabendo ?</p>
                <RadioGroup
                    value={form.whomInformed}
                    options={WhoInformedFromRadioOptions}
                    onChange={onWhoInformedChange}
                />
            </div>

            {/* Seção Sim Ou Não */}

            {/* Seção Computador próprio */}
            <div className='register-steps__card'>
                <div className='register-steps__inline-field'>
                    <p className='field-label'>Tem computador próprio?</p>
                    <RadioGroup
                        value={String(form.hasOwnComputer ?? '')}
                        options={yesNoOptions}
                        onChange={onOwnComputerChange}
                    />
                </div>

                {/* Seção Acesso a internet */}
                <div className='register-steps__inline-field'>
                    <p className='field-label'>Acesso à internet?</p>
                    <RadioGroup
                        value={String(form.hasInternetAccess ?? '')}
                        options={yesNoOptions}
                        onChange={onInternetAccessChange}
                    />
                </div>
                {/* Seção Compromete a participação */}
                <div className='register-steps__inline-field'>
                    <p className='field-label'>
                        Se compromete a participar das aulas?
                    </p>
                    <RadioGroup
                        value={String(form.compromisedToClasses ?? '')}
                        options={yesNoOptions}
                        onChange={onCompromisedToClassesChange}
                    />
                </div>
            </div>

            {/*Seção Socioeconômica*/}
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <LocalAtmIcon />
                </InputAdornment>
                <span>Perfil Socioeconômico</span>
            </div>

            {/*Seção Renda familiar*/}
            <div className='register-steps__field'>
                <p className='field-label'>Renda familiar mensal</p>
                <RadioGroup
                    value={form.familyIncome}
                    options={familyIncomeOptions}
                    onChange={onFamilyIncomeChange}
                />
            </div>

            {/*Seção Pessoas na casa*/}
            <div className='register-steps__field'>
                <p className='field-label'>Quantas pessoas vivem na casa?</p>
                <Input
                    placeholder='Ex: 3'
                    onChange={onPeopleInHouseChange}
                    value={form.peopleInHouse ?? ''}
                />
            </div>

            {/*Seção Benefício social*/}
            <div className='register-steps__field'>
                <p className='field-label'>Recebe algum benefício social?</p>
                <RadioGroup
                    value={form.socialBenefit}
                    options={socialBenefitOptions}
                    onChange={onSocialBenefitChange}
                />
            </div>
        </div>
    );
}

export function validateFormStep3(form: UserRegisterPayload) {
    if (!form.whyJoinFatiLab?.trim()) {
        toast.error(
            "O campo 'Por que você quer participar do FatiLab' é obrigatório",
        );
        throw new Error('Missing parameter');
    }
}
