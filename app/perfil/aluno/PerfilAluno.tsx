'use client';

import './PerfilAluno.scss';

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/base';
import { toast } from 'react-toastify';
import { useGetPublicCep } from '@/services/api-external/cep/queries';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

interface DadosPessoais {
  nomeCompleto: string;
  nomeSocial: string;
  cpf: string;
  tipoDeficiencia: string;
}

type ContatoForm = {
  cep?: string;
  address?: string;
  complement?: string;
  neighbourhood?: string;
  city?: string;
  state?: string;
  telefone?: string;
};

type PerfilProfissional = {
  escolaridade: string;
  curso: string;
  instituicao: string;
  trabalhando: string;
  areaAtuacao: string;
  programacao: string;
  cursoTecnologia: string;
};

interface PerfilAlunoProps {
  dadosPessoais?: DadosPessoais;
  contato?: ContatoForm;
  onSave?: (contato: ContatoForm) => Promise<void>;
}

/* ───── RadioGroup fora do componente pai para evitar re-mounts ───── */

function RadioGroup({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="perfil-aluno-radio-group">
      {['sim', 'nao'].map((opcao) => (
        <label
          key={opcao}
          className={`perfil-aluno-radio-card ${value === opcao ? 'perfil-aluno-radio-card--selected' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={opcao}
            checked={value === opcao}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>{opcao === 'sim' ? 'Sim' : 'Não'}</span>
        </label>
      ))}
    </div>
  );
}

export default function PerfilAluno({
  dadosPessoais,
  contato: initialContato,
  onSave,
}: PerfilAlunoProps) {

  {/*Seção safe values*/}

  const safeDadosPessoais: DadosPessoais = {
    nomeCompleto: dadosPessoais?.nomeCompleto ?? 'Mayra Bordin de Abreu',
    nomeSocial: dadosPessoais?.nomeSocial ?? 'Mayra Bordin',
    cpf: dadosPessoais?.cpf ?? '123.456.789-00',
    tipoDeficiencia: dadosPessoais?.tipoDeficiencia ?? 'Nenhuma',
  };

  {/*Seção States*/}
  const [form, setForm] = useState<ContatoForm>({
    cep: initialContato?.cep ?? '',
    address: initialContato?.address ?? '',
    complement: initialContato?.complement ?? '',
    neighbourhood: initialContato?.neighbourhood ?? '',
    city: initialContato?.city ?? '',
    state: initialContato?.state ?? '',
    telefone: initialContato?.telefone ?? '',
  });

  const [cepInput, setCepInput] = useState<string>(initialContato?.cep ?? '');
  const [saving, setSaving] = useState(false);

  // estados de perfil agrupados
  const [perfil, setPerfil] = useState<PerfilProfissional>({
    escolaridade: '',
    curso: '',
    instituicao: '',
    trabalhando: '',
    areaAtuacao: '',
    programacao: '',
    cursoTecnologia: '',
  });

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  {/*Seção CEP API*/}

  const {
    data: cepData,
    error,
    isLoading: loadingCep,
  } = useGetPublicCep(cepInput);

 {/*Seção Effects*/}

  useEffect(() => {
    if (!cepData || error) return;

    if (cepData.erro === 'true') {
      if (cepInput.length === 8) toast.error('CEP inválido');
      return;
    }

    setForm((prev: ContatoForm) => ({
      ...prev,
      address: cepData.logradouro ?? '',
      neighbourhood: cepData.bairro ?? '',
      city: cepData.localidade ?? '',
      state: cepData.uf ?? '',
    }));
  }, [cepData, error, cepInput]);

  useEffect(() => {
    if (cepInput.length < 8) {
      setForm((prev: ContatoForm) => ({
        ...prev,
        address: '',
        neighbourhood: '',
        city: '',
        state: '',
      }));
    }
  }, [cepInput]);

  /* ───── Handlers ───── */

  function onCepChange(e: ChangeEvent<HTMLInputElement>) {
    const sanitized = e.target.value.replace(/\D/g, '');
    if (sanitized.length > 8) return;

    setForm((prev: ContatoForm) => ({ ...prev, cep: sanitized }));

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setCepInput(sanitized), 400);
  }

  function onTelefoneChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setForm((prev: ContatoForm) => ({ ...prev, telefone: value }));
  }

  function onComplementChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev: ContatoForm) => ({ ...prev, complement: e.target.value }));
  }

  function onPerfilChange(field: keyof PerfilProfissional, value: string) {
  setPerfil((prev) => {
    const updated = { ...prev, [field]: value };

    // se desmarcou que está trabalhando, limpa a área de atuação
    if (field === 'trabalhando' && value === 'nao') {
      updated.areaAtuacao = '';
    }

    return updated;
  });
}

 {/*Seção Mensagem de validação*/}
  async function handleSave() {
    try {
      validateContato(form);
      setSaving(true);
      await onSave?.(form);
      toast.success('Contato atualizado com sucesso!');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="perfil-aluno-page">

      {/* Header */}
      <div className="perfil-aluno-page__header">
        <h1>Meu Perfil</h1>
        <p>
          Gerencie suas <span>informações pessoais</span> e dados de <span>contato</span>.
        </p>
      </div>

       {/*Seção Dados Pessoais*/}
      <div className="perfil-aluno-card">
        <div className="perfil-aluno-card__title">
          <PersonIcon />
          <span>Dados Pessoais</span>
        </div>

        <div className="perfil-aluno-grid">
          <div className="perfil-aluno-field">
            <label>Nome Completo</label>
            <Input value={safeDadosPessoais.nomeCompleto} disabled />
          </div>

          <div className="perfil-aluno-field">
            <label>CPF</label>
            <Input value={safeDadosPessoais.cpf} disabled />
          </div>

          <div className="perfil-aluno-field">
            <label>Nome Social</label>
            <Input value={safeDadosPessoais.nomeSocial} disabled />
          </div>

          <div className="perfil-aluno-field">
            <label>Tipo de Deficiência</label>
            <Input value={safeDadosPessoais.tipoDeficiencia} disabled />
          </div>
        </div>
      </div>

      {/*Seção Contato*/}
      <div className="perfil-aluno-card">
        <div className="perfil-aluno-card__title">
          <HomeIcon />
          <span>Contato</span>
        </div>

        <div className="perfil-aluno-grid">
          <div className="perfil-aluno-field">
            <label>Telefone</label>
            <Input
              placeholder="(00) 00000-0000"
              onChange={onTelefoneChange}
              value={form.telefone ?? ''}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>CEP</label>
            <Input
              placeholder="00000-000"
              onChange={onCepChange}
              value={form.cep ?? ''}
              disabled={loadingCep}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Endereço</label>
            <Input
              disabled
              placeholder="Preenchido automaticamente"
              value={form.address ?? ''}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Complemento</label>
            <Input
              placeholder="Apto 101"
              onChange={onComplementChange}
              value={form.complement ?? ''}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Cidade</label>
            <Input disabled placeholder="Cidade" value={form.city ?? ''} />
          </div>

          <div className="perfil-aluno-field">
            <label>Estado</label>
            <Input disabled placeholder="UF" value={form.state ?? ''} />
          </div>
        </div>
      </div>

     {/*Seção Escolaridade*/}
      <div className="perfil-aluno-card">
        <div className="perfil-aluno-card__title">
          <SchoolIcon />
          <span>Escolaridade</span>
        </div>

        <div className="perfil-aluno-grid">
          <div className="perfil-aluno-field perfil-aluno-field--full">
            <label>Nível de escolaridade</label>

            <div className="perfil-aluno-radio-group">
              {[
                { value: 'fundamental-incompleto', label: 'Fundamental Incompleto' },
                { value: 'medio-completo',         label: 'Médio Completo'         },
                { value: 'superior-incompleto',    label: 'Superior Incompleto'    },
                { value: 'superior-completo',      label: 'Superior Completo'      },
              ].map((opcao) => (
                <label
                  key={opcao.value}
                  className={`perfil-aluno-radio-card ${perfil.escolaridade === opcao.value ? 'perfil-aluno-radio-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="escolaridade"
                    value={opcao.value}
                    checked={perfil.escolaridade === opcao.value}
                    onChange={(e) => onPerfilChange('escolaridade', e.target.value)}
                  />
                  <span>{opcao.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="perfil-aluno-field">
            <label>Curso</label>
            <Input
              placeholder="Nome do curso"
              value={perfil.curso}
              onChange={(e) => onPerfilChange('curso', e.target.value)}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Instituição de ensino</label>
            <Input
              placeholder="Nome da instituição"
              value={perfil.instituicao}
              onChange={(e) => onPerfilChange('instituicao', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Perfil Profissional */}
      <div className="perfil-aluno-card">
        <div className="perfil-aluno-card__title">
          <WorkIcon />
          <span>Perfil Profissional</span>
        </div>

        <div className="perfil-aluno-grid">
          <div className="perfil-aluno-field perfil-aluno-field--full">
            <label>Você está trabalhando atualmente?</label>
            <RadioGroup
              name="trabalhando"
              value={perfil.trabalhando}
              onChange={(val) => onPerfilChange('trabalhando', val)}
            />
          </div>

          <div className="perfil-aluno-field perfil-aluno-field--full">
            <label>Área de atuação (se sim)</label>
            <Input
              placeholder="Ex: Vendas, Administrativo..."
              value={perfil.areaAtuacao}
              onChange={(e) => onPerfilChange('areaAtuacao', e.target.value)}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Já trabalhou com programação?</label>
            <RadioGroup
              name="programacao"
              value={perfil.programacao}
              onChange={(val) => onPerfilChange('programacao', val)}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Já participou de curso de tecnologia?</label>
            <RadioGroup
              name="curso-tecnologia"
              value={perfil.cursoTecnologia}
              onChange={(val) => onPerfilChange('cursoTecnologia', val)}
            />
          </div>
        </div>

        <div className="perfil-aluno-actions">
          <button
            type="button"
            className="perfil-aluno-button"
            onClick={handleSave}
            disabled={saving || loadingCep}
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>

    </div>
  );
}

export function validateContato(form: ContatoForm) {
  const cep = form.cep?.replace(/\D/g, '');

  if (!cep || cep.length !== 8) {
    toast.error('CEP inválido ou faltante');
    throw new Error('Missing parameter');
  }

  if (!form.address?.trim()) {
    toast.error('Endereço é obrigatório');
    throw new Error('Missing parameter');
  }

  if (!form.city?.trim()) {
    toast.error('Cidade é obrigatória');
    throw new Error('Missing parameter');
  }

  if (!form.state?.trim()) {
    toast.error('Estado é obrigatório');
    throw new Error('Missing parameter');
  }
}