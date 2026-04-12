import { UserRegisterPayload } from "@/dtos/UserDto";
import DescriptionIcon from '@mui/icons-material/Description';
import { InputAdornment } from "@mui/material";
import React from "react";



export function RegisterStep3({ form, setForm }:
    {
        form: UserRegisterPayload;
        setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>
    }) {
    return (
        <div className='register-steps'>
<<<<<<< Updated upstream
=======

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

            {/* Seção Sim Ou Não */}

            {/* Seção Computador próprio */}
            <div className="register-steps__card">
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

            {/*Seção Socioeconômica*/}
>>>>>>> Stashed changes
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
    )
}