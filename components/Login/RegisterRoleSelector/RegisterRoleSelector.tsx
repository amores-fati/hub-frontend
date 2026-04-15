import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import { CardContent } from '@mui/material';
import './index.scss';

type RegisterRoleSelectorProps = {
    onBack: () => void;
    onSelectStudent: () => void;
    onSelectCompany: () => void;
};

export function RegisterRoleSelector({
    onBack,
    onSelectStudent,
    onSelectCompany,
}: RegisterRoleSelectorProps) {
    return (
        <CardContent className='login-page__card-content'>
            <div className='login-page__register'>
                <div className='login-page__register-back' onClick={onBack}>
                    <ArrowBackIcon />
                    <span>Voltar</span>
                </div>
                <h3 className='login-page__register-title'>
                    Qual cadastro deseja realizar?
                </h3>
                <div className='login-page__register-cards'>
                    <div
                        className='login-page__register-card'
                        onClick={onSelectStudent}
                    >
                        <div className='login-page__register-card-color'></div>
                        <div className='login-page__register-card-content'>
                            <SchoolIcon className='login-page__register-icon' />
                            <span>Sou Aluno</span>
                        </div>
                    </div>
                    <div
                        className='login-page__register-card'
                        onClick={onSelectCompany}
                    >
                        <div className='login-page__register-card-color'></div>
                        <div className='login-page__register-card-content'>
                            <BusinessIcon className='login-page__register-icon' />
                            <span>Sou Empresa</span>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    );
}
