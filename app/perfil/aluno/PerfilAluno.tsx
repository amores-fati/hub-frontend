'use client';

import './PerfilAluno.scss';

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/base';
import { StudentRegisterPayload } from '@/dtos/StudentDto';
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

interface PerfilAlunoProps {
  dadosPessoais?: DadosPessoais;
  contato?: ContatoForm;
  onSave?: (contato: ContatoForm) => Promise<void>;
}

export default function PerfilAluno({
  dadosPessoais,
  contato: initialContato,
  onSave,
}: PerfilAlunoProps) {

  /* ───── Safe values ───── */

  const safeDadosPessoais: DadosPessoais = {
    nomeCompleto: dadosPessoais?.nomeCompleto ?? '',
    nomeSocial: dadosPessoais?.nomeSocial ?? '',
    cpf: dadosPessoais?.cpf ?? '',
    tipoDeficiencia: dadosPessoais?.tipoDeficiencia ?? '',
  };

  const safeContato: ContatoForm = {
    cep: initialContato?.cep ?? '',
    address: initialContato?.address ?? '',
    complement: initialContato?.complement ?? '',
    neighbourhood: initialContato?.neighbourhood ?? '',
    city: initialContato?.city ?? '',
    state: initialContato?.state ?? '',
    telefone: initialContato?.telefone ?? '',
  };

  /* ───── States ───── */

  const [form, setForm] = useState<ContatoForm>(safeContato);
  const [cepInput, setCepInput] = useState<string>(safeContato.cep ?? '');
  const [saving, setSaving] = useState(false);

  const [escolaridade, setEscolaridade] = useState('');
  const [curso, setCurso] = useState('');
  const [instituicao, setInstituicao] = useState('');

  const [trabalhando, setTrabalhando] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [programacao, setProgramacao] = useState('');
  const [cursoTecnologia, setCursoTecnologia] = useState('');

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ───── CEP API ───── */

  const {
    data: cepData,
    error,
    isLoading: loadingCep,
  } = useGetPublicCep(cepInput);

  /* ───── Effects ───── */

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

  // FIX: função estava sendo usada no JSX mas não havia sido definida
  function onTelefoneChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setForm((prev: ContatoForm) => ({ ...prev, telefone: value }));
  }

  // FIX: função estava sendo usada no JSX mas não havia sido definida
  function onComplementChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev: ContatoForm) => ({ ...prev, complement: e.target.value }));
  }

  function handleSave() {
    try {
      validateContato(form);
      setSaving(true);
      onSave?.(form);
      toast.success('Contato atualizado com sucesso!');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  // FIX: div "perfil-aluno-page" estava duplicada/aninhada — removida a segunda abertura
  return (
    <div className="perfil-aluno-page">

      {/* Header */}
      <div className="perfil-aluno-page__header">
        <h1>Meu Perfil</h1>
        <p>
          Gerencie suas <span>informações pessoais</span> e dados de <span>contato</span>.
        </p>
      </div>

      {/* Dados Pessoais */}
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

      {/* Contato */}
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

      {/* Escolaridade */}
      <div className="perfil-aluno-card">
        <div className="perfil-aluno-card__title">
          <SchoolIcon />
          <span>Escolaridade</span>
        </div>

        <div className="perfil-aluno-grid">
          <div className="perfil-aluno-field perfil-aluno-field--full">
            <label>Nível de escolaridade</label>

            {[
              'fundamental-incompleto',
              'medio-completo',
              'superior-incompleto',
              'superior-completo',
            ].map((nivel) => (
              <label key={nivel}>
                <input
                  type="radio"
                  name="escolaridade"
                  value={nivel}
                  checked={escolaridade === nivel}
                  onChange={(e) => setEscolaridade(e.target.value)}
                />
                <span>{nivel.replace('-', ' ')}</span>
              </label>
            ))}
          </div>

          <div className="perfil-aluno-field">
            <label>Curso</label>
            <Input
              placeholder="Nome do curso"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Instituição</label>
            <Input
              placeholder="Nome da instituição"
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
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

            <div className="perfil-aluno-radio-inline">
              {/* FIX: value e onChange vinculados ao estado */}
              <label className="perfil-aluno-radio">
                <input
                  type="radio"
                  name="trabalhando"
                  value="sim"
                  checked={trabalhando === 'sim'}
                  onChange={(e) => setTrabalhando(e.target.value)}
                />
                <span>Sim</span>
              </label>

              <label className="perfil-aluno-radio">
                <input
                  type="radio"
                  name="trabalhando"
                  value="nao"
                  checked={trabalhando === 'nao'}
                  onChange={(e) => setTrabalhando(e.target.value)}
                />
                <span>Não</span>
              </label>
            </div>
          </div>

          <div className="perfil-aluno-field perfil-aluno-field--full">
            <label>Área de atuação (se sim)</label>
            {/* FIX: value estava hardcoded como "" em vez de usar o estado */}
            <Input
              placeholder="Ex: Vendas, Administrativo..."
              value={areaAtuacao}
              onChange={(e) => setAreaAtuacao(e.target.value)}
            />
          </div>

          <div className="perfil-aluno-field">
            <label>Já trabalhou com programação?</label>

            <div className="perfil-aluno-radio-inline">
              {/* FIX: value e onChange vinculados ao estado */}
              <label className="perfil-aluno-radio">
                <input
                  type="radio"
                  name="programacao"
                  value="sim"
                  checked={programacao === 'sim'}
                  onChange={(e) => setProgramacao(e.target.value)}
                />
                <span>Sim</span>
              </label>

              <label className="perfil-aluno-radio">
                <input
                  type="radio"
                  name="programacao"
                  value="nao"
                  checked={programacao === 'nao'}
                  onChange={(e) => setProgramacao(e.target.value)}
                />
                <span>Não</span>
              </label>
            </div>
          </div>

          <div className="perfil-aluno-field">
            <label>Já participou de curso de tecnologia?</label>

            <div className="perfil-aluno-radio-inline">
              {/* FIX: value e onChange vinculados ao estado */}
              <label className="perfil-aluno-radio">
                <input
                  type="radio"
                  name="curso-tecnologia"
                  value="sim"
                  checked={cursoTecnologia === 'sim'}
                  onChange={(e) => setCursoTecnologia(e.target.value)}
                />
                <span>Sim</span>
              </label>

              <label className="perfil-aluno-radio">
                <input
                  type="radio"
                  name="curso-tecnologia"
                  value="nao"
                  checked={cursoTecnologia === 'nao'}
                  onChange={(e) => setCursoTecnologia(e.target.value)}
                />
                <span>Não</span>
              </label>
            </div>
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