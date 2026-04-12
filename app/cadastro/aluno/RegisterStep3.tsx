import { Input, RadioGroup } from "@/components/base";
import { UserRegisterPayload, WhoInformed } from "@/dtos/UserDto";
import DescriptionIcon from '@mui/icons-material/Description';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { InputAdornment } from "@mui/material";
import React, { ChangeEvent } from "react";
import { toast } from "react-toastify";

const GenderRadioOptions = [
    { label: 'Instagram', value: WhoInformed.INSTAGRAM },
    { label: 'Indicação', value: WhoInformed.REFEREE },
    { label: 'Linkedin', value: WhoInformed.LINKEDIN },
    { label: 'Outros', value: WhoInformed.OTHERS }
];

const yesNoOptions = [
    { label: "Sim", value: "true" },
    { label: "Não", value: "false" },
];

export function RegisterStep3({ form, setForm }: {
    form: UserRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>;
}) {

    function onWhyJoinFatiLabChange(newValue: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, whyJoinFatiLab: newValue.target.value }));
    }

    function onWhoInformedChange(_: ChangeEvent<HTMLInputElement> | undefined, value: string) {
        setForm((prev) => ({ ...prev, whomInformed: value as WhoInformed }));
    }

    function onOwnComputerChange(_: ChangeEvent<HTMLInputElement> | undefined, value: string) {
        setForm((prev) => ({ ...prev, hasOwnComputer: value === "true" }));
    }

    function onInternetAccessChange(_: ChangeEvent<HTMLInputElement> | undefined, value: string) {
        setForm((prev) => ({ ...prev, hasInternetAccess: value === "true" }));
    }

    function onCommitsToClassesChange(_: ChangeEvent<HTMLInputElement> | undefined, value: string) {
        setForm((prev) => ({ ...prev, commitsToClasses: value === "true" }));
    }

    return (
        <div className='register-steps'>

            {/*Seção fatiLab*/}
            <div className="register-steps__section-title">
                <InputAdornment position='start'>
                    <InfoOutlinedIcon />
                </InputAdornment>
                <span>Sobre o FatiLab</span>
            </div>

            {/*Seção Por que fatiLab*/}
            <div className='register-steps__field register-steps__field--full-width'>
                <div className='register-steps__field'>
                    <p className='field-label'> Por que você quer participar do FatiLab? <span className='required'>*</span> </p>
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
                <RadioGroup value={form.whomInformed} options={GenderRadioOptions} onChange={onWhoInformedChange} />
            </div>

            {/* Seção Computador próprio */}
            <div className="register-steps__yes-no-card">
                <div className="register-steps__inline-field">
                    <p className="field-label">Tem computador próprio?</p>
                    <RadioGroup
                        value={String(form.hasOwnComputer ?? "")}
                        options={yesNoOptions}
                        onChange={onOwnComputerChange}
                    />
                </div>

                {/* Seção Acesso a internet */}
                <div className="register-steps__inline-field">
                    <p className="field-label">Acesso à internet?</p>
                    <RadioGroup
                        value={String(form.hasInternetAccess ?? "")}
                        options={yesNoOptions}
                        onChange={onInternetAccessChange}
                    />
                </div>

                {/* Seção Compromete a participação */}
                <div className="register-steps__inline-field">
                    <p className="field-label">Se compromete a participar das aulas?</p>
                    <RadioGroup
                        value={String(form.compromisedToClasses ?? "")}
                        options={yesNoOptions}
                        onChange={onCommitsToClassesChange}
                    />
                </div>
            </div>

            {/*Seção Informações adicionais*/}
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <DescriptionIcon />
                </InputAdornment>
                <span>Informações adicionais</span>
            </div>

            <div className='register-steps__grid'>
                <p>Informações adicionais</p>
            </div>
        </div>
    );
}

export function validateFormStep3(form: UserRegisterPayload) {
    if (!form.whyJoinFatiLab?.trim()) {
        toast.error('Por que você quer participar do FatiLab é obrigatório');
        throw ('Missing parameter');
    }
}
