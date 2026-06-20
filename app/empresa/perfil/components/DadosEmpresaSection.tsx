import DescriptionIcon from '@mui/icons-material/Description';
import { EditCompanyForm } from '../Types';
import { SectionCard } from './SectionCard';

type Props = {
    form: EditCompanyForm;
};

export function DadosEmpresaSection({ form }: Props) {
    return (
        <SectionCard icon={<DescriptionIcon />} title='Dados da Empresa'>
            <div className='perfil-grid perfil-grid--2'>
                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Nome da Empresa
                    </label>
                    <p className='perfil-field__readonly'>
                        {form.companyName || '—'}
                    </p>
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>CNPJ</label>
                    <p className='perfil-field__readonly'>{form.cnpj || '—'}</p>
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>Nome Fantasia</label>
                    <p className='perfil-field__readonly'>
                        {form.tradeName || '—'}
                    </p>
                </div>

                <div className='perfil-field'>
                    <label className='perfil-field__label'>
                        Nome do Sócio Proprietário
                    </label>
                    <p className='perfil-field__readonly'>
                        {form.ownerName || '—'}
                    </p>
                </div>
            </div>
        </SectionCard>
    );
}