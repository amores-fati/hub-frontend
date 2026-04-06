import { UserRegisterPayload } from "@/dtos/UserDto";
import DescriptionIcon from '@mui/icons-material/Description';
import { InputAdornment } from "@mui/material";
import React from "react";



export function RegisterStep2({ form, setForm }:
    {
        form: UserRegisterPayload;
        setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>
    }) {
    return (
        <div className='register-steps'>
            <div className='register-steps__section-title'>
                <InputAdornment position='start'>
                    <DescriptionIcon />
                </InputAdornment>
                <span>Endereço e experiência</span>
            </div>

            <div className='register-steps__grid'>
                <p>Endereço e experiência</p>
            </div>
        </div>
    )
}