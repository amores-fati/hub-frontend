import { Input, RadioGroup, Select } from '@/components/base';
import { Option } from '@/components/base/Select/select';
import {
    Gender,
    Race,
    SocialBenefit,
    WhoInformed,
} from '@/dtos/StudentDto';
import { dateRegex, integerRegex } from '@/utils/regex';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ChangeEvent } from 'react';
import { SingleValue } from 'react-select';
import { EditProfileForm, EditProfileFormSetter } from '../types';
import { SectionCard } from './SectionCard';

const GenderOptions = [
    { label: 'Feminino', value: Gender.FEMALE },
    { label: 'Masculino', value: Gender.MALE },
    { label: 'Não-binário', value: Gender.NON_BINARY },
    { label: 'Prefiro não informar', value: Gender.PREFER_NOT_TO_SAY },
    { label: 'Outro', value: Gender.OTHER },
];

const RaceOptions: Option[] = [
    { label: 'Branco', value: Race.WHITE },
    { label: 'Preto', value: Race.BLACK },
    { label: 'Pardo', value: Race.BROWN },
    { label: 'Indígena', value: Race.INDIGENOUS },
    { label: 'Prefiro não dizer', value: Race.PREFER_NOT_TO_SAY },
];

const HowHeardOptions: Option[] = [
    { label: 'Instagram', value: WhoInformed.INSTAGRAM },
    { label: 'Indicação', value: WhoInformed.REFEREE },
    { label: 'LinkedIn', value: WhoInformed.LINKEDIN },
    { label: 'Outros', value: WhoInformed.OTHERS },
];

const SocialBenefitOptions: Option[] = [
    { label: 'Bolsa Família', value: SocialBenefit.BOLSA_FAMILIA },
    { label: 'BPC', value: SocialBenefit.BPC },
    { label: 'Nenhum', value: SocialBenefit.NONE },
    { label: 'Outros', value: SocialBenefit.OTHERS },
];

const YesNoOptions = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
];

type Props = {
    form: EditProfileForm;
    setForm: EditProfileFormSetter;
};

export function OutrasInformacoesSection({ form, setForm }: Props) {
    function onBirthDateChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            birthDate: dateRegex(e.target.value) ?? '',
        }));
    }

    function onGenderChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        setForm((prev) => ({ ...prev, gender: value as Gender }));
    }

    function onRaceChange(value: SingleValue<Option>) {
        setForm((prev) => ({ ...prev, race: value?.value as Race }));
    }

    function onHowHeardChange(value: SingleValue<Option>) {
        setForm((prev) => ({
            ...prev,
            howHeard: value?.value as WhoInformed,
        }));
    }

    function onSocialBenefitChange(value: SingleValue<Option>) {
        setForm((prev) => ({
            ...prev,
            socialBenefit: value?.value as SocialBenefit,
        }));
    }

    function onHouseholdSizeChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            householdSize: integerRegex(e.target.value) ?? '',
        }));
    }

    function onHasComputerChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        setForm((prev) => ({ ...prev, hasComputer: value === 'true' }));
    }

    function onHasInternetChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        setForm((prev) => ({ ...prev, hasInternet: value === 'true' }));
    }

    function onCommittedChange(_: ChangeEvent<HTMLInputElement>, value: string) {
        setForm((prev) => ({
            ...prev,
            committedToParticipate: value === 'true',
        }));
    }

    function onMotivationChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, motivation: e.target.value }));
    }

    return (
        <SectionCard icon={<InfoOutlinedIcon />} title='Outras informações'>
            <div className='perfil-grid perfil-grid--2'>
                <div className='perfil-field'>
                    <label className='perfil-field__label'>Data de nascimento</label>
                    <Input
                        placeholder='dd/mm/aaaa'
                        value={form.birthDate}
                        onChange={onBirthDateChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Cor / Raça</label>
                    <Select
                        placeholder='Selecione'
                        value={RaceOptions.find((o) => o.value === form.race)}
                        options={RaceOptions}
                        onChange={onRaceChange}
                    />
                </div>

                <div className='perfil-field perfil-field--full'>
                    <label className='perfil-field__label'>Gênero</label>
                    <RadioGroup
                        value={form.gender}
                        options={GenderOptions}
                        onChange={onGenderChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Como ficou sabendo do Instituto?
                    </label>
                    <Select
                        placeholder='Selecione'
                        value={HowHeardOptions.find(
                            (o) => o.value === form.howHeard,
                        )}
                        options={HowHeardOptions}
                        onChange={onHowHeardChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Benefício social</label>
                    <Select
                        placeholder='Selecione'
                        value={SocialBenefitOptions.find(
                            (o) => o.value === form.socialBenefit,
                        )}
                        options={SocialBenefitOptions}
                        onChange={onSocialBenefitChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Quantidade de pessoas no domicílio
                    </label>
                    <Input
                        placeholder='Ex: 4'
                        value={form.householdSize}
                        onChange={onHouseholdSizeChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Tem computador?</label>
                    <RadioGroup
                        value={String(form.hasComputer)}
                        options={YesNoOptions}
                        onChange={onHasComputerChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Tem acesso à internet?</label>
                    <RadioGroup
                        value={String(form.hasInternet)}
                        options={YesNoOptions}
                        onChange={onHasInternetChange}
                    />
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Compromisso com as aulas
                    </label>
                    <RadioGroup
                        value={String(form.committedToParticipate)}
                        options={YesNoOptions}
                        onChange={onCommittedChange}
                    />
                </div>

                <div className='perfil-field perfil-field--full'>
                    <label className='perfil-field__label'>
                        Motivação para se juntar ao Instituto
                    </label>
                    <Input
                        placeholder='Conte um pouco sobre sua motivação'
                        value={form.motivation}
                        onChange={onMotivationChange}
                    />
                </div>
            </div>
        </SectionCard>
    );
}
