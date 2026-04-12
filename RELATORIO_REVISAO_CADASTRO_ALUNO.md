# Relatório de Revisão de Código — Cadastro de Aluno (`/cadastro/aluno`)

**Data:** 12/04/2026
**Escopo:** Fluxo completo de registro de aluno (Steps 1–4)

---

## Problemas de Alta Prioridade

### 1. Stepper exibe o passo errado (off-by-one)

- **Arquivo:** `app/cadastro/aluno/CadastroAluno.tsx`, linha 126
- **Problema:** O componente `<Stepper>` do MUI utiliza índice baseado em **zero** (`0, 1, 2, 3`), mas o enum `StepperSteps` começa em **1** (`1, 2, 3, 4`). Isso faz com que o indicador visual do stepper esteja sempre **um passo à frente** do conteúdo real exibido.
- **Impacto:** O usuário vê "Endereço e experiência" destacado enquanto está preenchendo "Dados pessoais". Gera confusão e prejudica a experiência.
- **Correção:** Passar `activeStep - 1` para o Stepper:

```tsx
<Stepper activeStep={activeStep - 1}>
```

Ou alterar o enum para iniciar em `0`.

---

### 2. Valores do enum `Scholarship` não correspondem às opções do formulário

- **Arquivo:** `app/cadastro/aluno/RegisterStep2.tsx`, linhas 12–16
- **Arquivo relacionado:** `dtos/UserDto.ts`, linhas 17–23
- **Problema:** As opções de rádio usam valores hardcoded como `'FUNDAMENTAL_INCOMPLETO'` e `'MEDIO_COMPLETO'`, mas o enum `Scholarship` no DTO define valores completamente diferentes: `NO_EDUCATION`, `PRIMARY`, `SECONDARY`, `HIGHER`, `POSTGRADUATE`.
- **Impacto:** O valor armazenado no formulário **nunca corresponde** a um valor válido do enum. O backend provavelmente rejeitará o payload, e o campo `scholarship` do tipo `Scholarship | null` não terá correspondência correta.
- **Correção:** Alinhar os valores das opções com o enum do DTO, ou atualizar o enum para refletir os valores reais esperados pelo backend. Exemplo:

```tsx
const ScholarshipRadioOptions = [
    { label: 'Fundamental Incompleto', value: Scholarship.PRIMARY },
    { label: 'Médio Completo', value: Scholarship.SECONDARY },
    { label: 'Superior Incompleto', value: Scholarship.HIGHER },
    { label: 'Superior Completo', value: Scholarship.POSTGRADUATE },
];
```

> Confirme com o backend quais são os valores corretos antes de ajustar.

---

### 3. Nome do campo inconsistente: `commitsToClasses` vs `compromisedToClasses`

- **Arquivo:** `app/cadastro/aluno/RegisterStep3.tsx`, linhas 99–104
- **Arquivos relacionados:** `dtos/UserDto.ts` (linha 72), `CadastroAluno.tsx` (linha 63)
- **Problema:** O handler `onCommitsToClassesChange` grava no campo `commitsToClasses`, mas o tipo `UserRegisterPayload` define o campo como `compromisedToClasses`. O estado inicial em `CadastroAluno.tsx` também usa `compromisedToClasses`.
- **Impacto:** O valor selecionado pelo usuário é gravado em uma chave que **não existe** no tipo. O campo `compromisedToClasses` nunca é atualizado e permanece com o valor inicial (`false`). O backend recebe informação incorreta.
- **Correção:** Alterar o handler para usar o nome correto:

```tsx
function onCommitsToClassesChange(
    _: ChangeEvent<HTMLInputElement> | undefined,
    value: string,
) {
    setForm((prev: UserRegisterPayload) => ({
        ...prev,
        compromisedToClasses: value === 'true', // ← nome correto
    }));
}
```

---

### 4. Formulário não é realmente enviado ao backend

- **Arquivo:** `app/cadastro/aluno/CadastroAluno.tsx`, linhas 108–113
- **Problema:** Ao clicar em "Cadastrar" no último passo, o código apenas executa `window.alert(JSON.stringify(form))`. Não há chamada a nenhuma API/service para persistir o cadastro.
- **Impacto:** O fluxo de cadastro **não funciona de ponta a ponta**. O usuário preenche tudo, clica em cadastrar, e nada acontece além de um alerta no navegador.
- **Correção:** Implementar uma mutation (ex.: com React Query) que envie o payload para o endpoint de cadastro do backend. Exemplo:

```tsx
const onForward = async () => {
    handleNext();
    if (activeStep === StepperSteps.STEP4) {
        await registerStudent(form); // chamada real à API
    }
};
```

---

## Problemas de Média Prioridade

### 5. Label da renda familiar contradiz o valor do enum

- **Arquivo:** `app/cadastro/aluno/RegisterStep3.tsx`, linha 43
- **Problema:** O label diz `"Mais de 3 salários"` mas o valor é `FamilyIncome.LESS_THAN_3` (menos que 3).
- **Impacto:** Se o backend interpretar o valor do enum, a informação socioeconômica do aluno será registrada de forma **invertida**.
- **Correção:** Alinhar label e valor. Se o significado correto é "mais de 3", o enum deveria ser algo como `MORE_THAN_3`. Se o enum está certo, o label deveria ser "Menos de 3 salários". Confirme com o backend.

---

### 6. Handler `onBirthDateChange` usa padrão de estado desatualizado (stale state)

- **Arquivo:** `app/cadastro/aluno/RegisterStep1.tsx`, linhas 92–96
- **Problema:** Este handler usa `setForm({ ...form, ... })` diretamente em vez do updater funcional `setForm(prev => ({ ...prev, ... }))` que todos os outros handlers utilizam.
- **Impacto:** Se o React agrupar (batch) múltiplas atualizações de estado, este handler pode sobrescrever mudanças feitas por outros campos na mesma renderização.
- **Correção:**

```tsx
function onBirthDateChange(
    newValue: ChangeEvent<HTMLInputElement> | undefined,
) {
    setForm((prevState: UserRegisterPayload) => ({
        ...prevState,
        birthDate: dateRegex(newValue?.target?.value ?? null) ?? '',
    }));
}
```

---

### 7. Lógica de erro do CEP tem condições sobrepostas

- **Arquivo:** `app/cadastro/aluno/RegisterStep2.tsx`, linhas 35–41
- **Problema:** O primeiro `if` verifica `(error || cepData?.erro === 'true') && form.cep?.length === 8`. O segundo verifica `error && form.cep?.length < 8`. Quando há erro e o CEP tem 8 caracteres, apenas o toast é exibido, mas logo abaixo o `if (cepData)` pode ainda executar se `cepData` existir com `erro: 'true'`, sobrescrevendo os campos de endereço com dados vazios. Além disso, o código lê `form.cep` em vez de `cepInput`, que pode estar dessincronizado devido ao debounce.
- **Impacto:** Em certas condições de corrida, os campos de endereço podem ser preenchidos com dados inválidos ou limpos indevidamente.
- **Correção:** Adicionar um `return` ou verificar `cepData.erro` antes de preencher:

```tsx
useEffect(() => {
    if (!cepData || cepData.erro === 'true') {
        if (cepData?.erro === 'true' && cepInput.length === 8) {
            toast.error('CEP inválido');
        }
        return;
    }
    setForm((prevState) => ({
        ...prevState,
        address: cepData.logradouro,
        neighbourhood: cepData.bairro,
        state: cepData.uf,
        city: cepData.localidade,
    }));
}, [cepData, cepInput]);
```

---

### 8. Campos `peopleInHouse` e `socialBenefit` não inicializados no estado

- **Arquivo:** `app/cadastro/aluno/CadastroAluno.tsx`, linhas 39–75
- **Problema:** Os campos `peopleInHouse` e `socialBenefit` são utilizados no Step 3 mas não constam no estado inicial do `useState`.
- **Impacto:** Se o usuário não interagir com esses campos, eles serão `undefined` no payload final. Dependendo do backend, isso pode causar erro ou perda de dados.
- **Correção:** Adicionar ao estado inicial:

```tsx
const [form, setForm] = useState<UserRegisterPayload>({
    // ... campos existentes ...
    peopleInHouse: '',
    socialBenefit: undefined,
});
```

---

## Problemas de Baixa Prioridade

### 9. Variável com nome enganoso: `GenderRadioOptions` no Step 3

- **Arquivo:** `app/cadastro/aluno/RegisterStep3.tsx`, linha 15
- **Problema:** A variável que contém as opções de "Como ficou sabendo?" (Instagram, LinkedIn, etc.) se chama `GenderRadioOptions`, provavelmente por copy-paste do Step 1.
- **Impacto:** Não causa bug em runtime, mas dificulta a leitura e manutenção do código.
- **Correção:** Renomear para `WhoInformedRadioOptions`.

---

### 10. CPF sem validação de dígitos verificadores

- **Arquivo:** `app/cadastro/aluno/RegisterStep1.tsx`, linhas 272–275
- **Problema:** A validação apenas checa se o CPF tem 11 dígitos. CPFs inválidos como `000.000.000-00` ou `111.111.111-11` passam na validação.
- **Impacto:** Cadastros com CPFs inexistentes podem ser aceitos, gerando dados inconsistentes.
- **Correção:** Implementar o algoritmo de validação de CPF (módulo 11):

```tsx
function isValidCPF(cpf: string): boolean {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false; // todos iguais

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let check = 11 - (sum % 11);
    if (check >= 10) check = 0;
    if (parseInt(digits[9]) !== check) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    check = 11 - (sum % 11);
    if (check >= 10) check = 0;
    return parseInt(digits[10]) === check;
}
```

---

### 11. Data de nascimento sem validação semântica

- **Arquivo:** `app/cadastro/aluno/RegisterStep1.tsx`, linhas 276–279
- **Problema:** A validação apenas verifica se o tamanho da string é 10. Datas impossíveis como `99/99/9999` passam.
- **Impacto:** Dados inválidos podem ser enviados ao backend.
- **Correção:** Parsear a data e validar se é uma data real e razoável:

```tsx
const [day, month, year] = form.birthDate.split('/').map(Number);
const date = new Date(year, month - 1, day);
const isValid = date.getDate() === day
    && date.getMonth() === month - 1
    && date.getFullYear() === year;
```

---

### 12. Timeout do CEP não é limpo no unmount

- **Arquivo:** `app/cadastro/aluno/RegisterStep2.tsx`, linhas 66–79
- **Problema:** O `setTimeout` usado para debounce do CEP não é cancelado quando o componente desmonta.
- **Impacto:** Se o usuário navegar para outro step antes do timeout disparar, o callback tentará atualizar estado em um componente desmontado (warning no console no React 17, ignorado silenciosamente no React 18+).
- **Correção:** Adicionar um `useEffect` de cleanup:

```tsx
useEffect(() => {
    return () => {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
}, []);
```

---

### 13. Campo "Estado" (UF) desabilitado sem fallback

- **Arquivo:** `app/cadastro/aluno/RegisterStep2.tsx`, linhas 209–218
- **Problema:** O input de Estado é `disabled={true}`, ou seja, só pode ser preenchido pela API do CEP. Se a API falhar ou o CEP não retornar UF, o usuário não tem como preencher manualmente.
- **Impacto:** A validação do Step 2 exige que `state` esteja preenchido. O usuário fica travado sem poder avançar.
- **Correção:** Permitir edição manual como fallback, ou ao menos exibir uma mensagem clara sobre o problema.

---

## Resumo

| # | Prioridade | Problema | Arquivo |
|---|------------|----------|---------|
| 1 | **Alta** | Stepper off-by-one | `CadastroAluno.tsx:126` |
| 2 | **Alta** | Enum `Scholarship` diverge das opções | `RegisterStep2.tsx:12-16` |
| 3 | **Alta** | Campo `commitsToClasses` vs `compromisedToClasses` | `RegisterStep3.tsx:99-104` |
| 4 | **Alta** | Sem submissão real ao backend | `CadastroAluno.tsx:108-113` |
| 5 | **Média** | Label de renda familiar contradiz o enum | `RegisterStep3.tsx:43` |
| 6 | **Média** | Stale state no handler de data | `RegisterStep1.tsx:92-96` |
| 7 | **Média** | Lógica de erro do CEP com condições sobrepostas | `RegisterStep2.tsx:35-41` |
| 8 | **Média** | Campos não inicializados no state | `CadastroAluno.tsx:39-75` |
| 9 | **Baixa** | Nome enganoso `GenderRadioOptions` | `RegisterStep3.tsx:15` |
| 10 | **Baixa** | CPF sem validação de dígito verificador | `RegisterStep1.tsx:272` |
| 11 | **Baixa** | Data sem validação semântica | `RegisterStep1.tsx:276` |
| 12 | **Baixa** | Timeout do CEP sem cleanup | `RegisterStep2.tsx:66` |
| 13 | **Baixa** | Campo UF travado sem fallback | `RegisterStep2.tsx:209-218` |
