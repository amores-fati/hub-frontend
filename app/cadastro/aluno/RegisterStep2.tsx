import { UserRegisterPayload } from "@/dtos/UserDto";
import { Step, StepLabel } from "@mui/material";
import React from "react";
import { StepperSteps } from "./CadastroAluno";


export function RegisterStep2({ currentStepper, form, setForm }:
    {
        currentStepper: StepperSteps;
        form: UserRegisterPayload;
        setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>
    }) {
    return (
        <Step active={currentStepper === StepperSteps.STEP2}>
            <StepLabel>2</StepLabel>
            <p>Etapa de Registro de Aluno 2</p>
        </Step>
    )
}