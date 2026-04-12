# Code Review - Cadastro do Aluno (feat/student-register3)

Data: 12/04/2026

Este documento lista os problemas encontrados no PR da branch `feat/student-register3`.
Para cada item, explicamos **o que acontece**, **por que isso e um problema**, **qual o impacto** e **como resolver**.

A ideia e que cada pessoa responsavel pelo codigo consiga entender o problema, aprender com ele e aplicar a correcao.

---

## 1. Validacao do Step 1 esta totalmente comentada

**Arquivo:** `RegisterStep1.tsx`, linhas 189-217
**O que acontece:** A funcao `validateFormStep1` esta com todo o corpo comentado. Ela nao faz nada.
**Por que e um problema:** O usuario consegue avancar do Step 1 sem preencher nenhum campo — nome, CPF, email, senha, tudo pode ficar vazio.
**Impacto:** Dados invalidos ou vazios chegam ao final do formulario e podem ser enviados para o backend, gerando cadastros corrompidos ou erros na API.
**Como resolver:** Descomentar a validacao e garantir que ela funciona. Testar manualmente tentando avancar com campos vazios e verificar se o toast de erro aparece e o step nao avanca.

---

## 2. Botao "Cadastrar" faz apenas um window.alert

**Arquivo:** `CadastroAluno.tsx`, linha 93
**O que acontece:** Quando o usuario clica em "Cadastrar" no ultimo step, o unico resultado e um `window.alert(JSON.stringify(form))`.
**Por que e um problema:** Nao existe chamada a API, nao existe redirect, nao existe feedback real para o usuario. Se isso for codigo temporario, precisa estar marcado como TODO e nao deve ir para a branch de desenvolvimento sem ressalva.
**Impacto:** O usuario preenche o formulario inteiro e nada acontece. Alem disso, a senha aparece em texto puro no alert (problema de seguranca, ver item 14).
**Como resolver:** Substituir o `window.alert` por uma chamada real a API de cadastro. Se ainda nao houver endpoint pronto, pelo menos: (a) adicionar um comentario `// TODO: integrar com API`, (b) desabilitar o botao ou mostrar uma mensagem informando que o cadastro ainda nao esta disponivel, e (c) nunca exibir a senha em texto puro.

---

## 3. Throw de strings para controle de fluxo

**Arquivos:** `RegisterStep2.tsx` (linhas 239, 242, 248, 252, 256, 260), `RegisterStep3.tsx` (linha 202), `RegisterStep4.tsx` (linha 273)
**O que acontece:** As funcoes de validacao usam `throw ('Missing parameter')` para impedir o avanco do step. O `catch` no `CadastroAluno.tsx` (linha 79) captura qualquer erro e retorna `null`.
**Por que e um problema:**
- `throw` com string nao e um erro tipado — fica dificil saber o que deu errado em debug.
- O `catch` captura **qualquer** excecao, inclusive bugs reais (ex: um `TypeError` por acessar propriedade de `undefined`). Esses bugs seriam silenciosamente engolidos e o usuario so veria o step nao avancar, sem saber por que.
- Usar excecoes para controle de fluxo normal (validacao) e considerado anti-pattern porque excecoes sao para situacoes excepcionais, nao para logica esperada.

**Impacto:** Bugs reais ficam escondidos. O debugging fica muito mais dificil porque qualquer erro vira silencioso.
**Como resolver:** Fazer as funcoes `validateFormStepX` retornarem um booleano (`true`/`false`) ou um objeto `{ valid: boolean, errors: string[] }`. No `handleNext`, checar o retorno em vez de usar try/catch:

```tsx
const handleNext = () => {
    let isValid = false;
    switch (activeStep) {
        case StepperSteps.STEP1:
            isValid = validateFormStep1(form);
            break;
        // ...
    }
    if (!isValid) return;
    setActiveStep((prev) => Math.min(prev + 1, StepperSteps.STEP4));
};
```

---

## 4. Estado stale (desatualizado) no onForward

**Arquivo:** `CadastroAluno.tsx`, linhas 90-95
**O que acontece:**
```tsx
const onForward = () => {
    handleNext()          // chama setActiveStep (assíncrono)
    if (activeStep === StepperSteps.STEP4) {  // le o valor ANTIGO
        window.alert(JSON.stringify(form))
    }
}
```
**Por que e um problema:** No React, `setActiveStep` nao atualiza `activeStep` imediatamente. O valor lido na linha seguinte ainda e o valor anterior ao update. Isso acontece porque o React agenda as atualizacoes de estado para o proximo render — o valor so muda quando o componente re-renderiza.
**Impacto:** Funciona "por acidente" no Step 4 (porque o valor ja e STEP4 antes do click), mas o modelo mental esta errado. Se alguem mudar a logica futuramente, vai quebrar de formas confusas.
**Como resolver:** Separar a logica de submit da logica de navegacao. Uma abordagem:

```tsx
const onForward = () => {
    if (activeStep === StepperSteps.STEP4) {
        // Validar step 4 primeiro
        if (!validateFormStep4(form)) return;
        submitForm(form); // funcao dedicada para envio
        return;
    }
    handleNext();
};
```

---

## 5. Valores do enum Scholarship nao batem com as opcoes do radio

**Arquivo:** `RegisterStep2.tsx`, linhas 12-16 vs `UserDto.ts`, linhas 17-23
**O que acontece:** As opcoes do radio usam valores como `'FUNDAMENTAL_INCOMPLETO'` e `'MEDIO_COMPLETO'`, mas o enum `Scholarship` define `NO_EDUCATION`, `PRIMARY`, `SECONDARY`, `HIGHER`, `POSTGRADUATE`.
**Por que e um problema:** O cast `value as Scholarship` nao faz validacao em runtime — o TypeScript so checa tipos em tempo de compilacao. O valor que vai para o backend sera `'FUNDAMENTAL_INCOMPLETO'`, que nao existe no enum, e o backend provavelmente vai rejeitar ou ignorar.
**Impacto:** Escolaridade nunca sera salva corretamente. O backend pode retornar erro 400 ou salvar um valor invalido no banco.
**Como resolver:** Usar os valores do enum diretamente nas opcoes:

```tsx
const ScholarshipRadioOptions = [
    { label: 'Sem escolaridade', value: Scholarship.NO_EDUCATION },
    { label: 'Ensino Fundamental', value: Scholarship.PRIMARY },
    { label: 'Ensino Medio', value: Scholarship.SECONDARY },
    { label: 'Ensino Superior', value: Scholarship.HIGHER },
    { label: 'Pos-graduacao', value: Scholarship.POSTGRADUATE },
];
```

Se os labels precisam ser diferentes, tudo bem — mas os **values** devem vir do enum.

---

## 6. Label e valor de renda familiar nao batem

**Arquivo:** `RegisterStep3.tsx`, linhas 36-38
**O que acontece:** A opcao com valor `FamilyIncome.LESS_THAN_3` tem o label "Mais de 3 salarios". `LESS_THAN_3` significa "menos que 3", mas o texto diz "mais de 3".
**Por que e um problema:** Ou o nome do enum esta errado, ou o label esta errado. De qualquer forma, o dado salvo nao vai corresponder a escolha do usuario.
**Impacto:** Dados socioeconomicos incorretos no banco. Se usados para relatorios ou selecao de alunos, podem gerar decisoes erradas.
**Como resolver:** Alinhar com o time de produto/backend: qual e o valor correto? Se a intencao e "mais de 3 salarios", o enum deveria ser `MORE_THAN_3`. Se a intencao e "ate 3 salarios", o label esta errado. Corrigir o que estiver errado e garantir que backend e frontend usam o mesmo valor.

---

## 7. Variavel com nome enganoso: GenderRadioOptions no Step 3

**Arquivo:** `RegisterStep3.tsx`, linha 10
**O que acontece:** A variavel se chama `GenderRadioOptions`, mas contem opcoes de "Como ficou sabendo?" (Instagram, LinkedIn, Indicacao, Outros).
**Por que e um problema:** Foi claramente copiada do Step 1 e o nome nao foi atualizado. Qualquer pessoa que ler o codigo vai ficar confusa — "por que genero tem Instagram como opcao?"
**Impacto:** Nao causa bug funcional, mas dificulta muito a manutencao. Nomes enganosos fazem as pessoas perderem tempo tentando entender o codigo.
**Como resolver:** Renomear para `WhoInformedRadioOptions` ou `HowDidYouHearOptions`.

---

## 8. Campo "pessoas na casa" aceita texto livre

**Arquivo:** `RegisterStep3.tsx`, linhas 83-88 e template linha 178
**O que acontece:** O campo `peopleInHouse` e do tipo `string` no DTO e o input nao tem mascara numerica nem `type="number"`. O usuario pode digitar "abc" ou "-5".
**Por que e um problema:** O campo espera um numero, mas nao valida isso. Dados invalidos podem ser enviados ao backend.
**Impacto:** Dados inconsistentes no banco. Relatorios que somam ou fazem media desse campo vao quebrar.
**Como resolver:** Duas opcoes:
- Simples: adicionar `type="number"` no Input e mudar o tipo no DTO para `number`.
- Melhor: criar uma mascara que so aceite digitos (similar ao que ja foi feito com CPF e telefone) e validar no `validateFormStep3`.

---

## 9. Dependencias faltando nos useEffect

**Arquivo:** `RegisterStep2.tsx`, linhas 44 e 57
**O que acontece:**
```tsx
useEffect(() => { ... setForm(...) ... }, [cepData]);     // falta setForm
useEffect(() => { ... setForm(...) ... }, [cepInput]);    // falta setForm
```
**Por que e um problema:** O ESLint com a regra `react-hooks/exhaustive-deps` vai alertar sobre isso. Embora `setForm` (retorno de `useState`) seja estavel e nao mude entre renders, declarar todas as dependencias e uma boa pratica porque: (a) evita warnings no lint, (b) torna explicito o que o efeito depende, e (c) se no futuro alguem trocar por um setter diferente, o efeito vai reagir corretamente.
**Impacto:** Baixo impacto funcional neste caso, mas cria o habito de ignorar dependencias de useEffect, o que em outros cenarios pode causar bugs serios (loops infinitos ou efeitos que nao re-executam quando deveriam).
**Como resolver:** Adicionar `setForm` ao array de dependencias:
```tsx
useEffect(() => { ... }, [cepData, setForm]);
useEffect(() => { ... }, [cepInput, setForm]);
```

---

## 10. Handlers onChange muito repetitivos

**Arquivos:** `RegisterStep1.tsx`, `RegisterStep2.tsx`, `RegisterStep3.tsx`
**O que acontece:** Cada step tem 5 a 10 funcoes quase identicas como:
```tsx
function onFullNameChange(newValue) {
    setForm(prev => ({ ...prev, fullName: newValue?.target?.value ?? '' }));
}
function onSocialNameChange(newValue) {
    setForm(prev => ({ ...prev, socialName: newValue?.target?.value ?? '' }));
}
// ... e assim por diante
```
**Por que e um problema:** Codigo duplicado. Se precisar mudar a logica (ex: adicionar trim), tem que mudar em 15+ lugares. Alem disso, mais codigo = mais chance de erro.
**Impacto:** Manutencao mais dificil e codigo mais dificil de ler.
**Como resolver:** Criar um handler generico:

```tsx
function handleInputChange(field: keyof UserRegisterPayload) {
    return (e: ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };
}
```

Uso:
```tsx
<Input onChange={handleInputChange('fullName')} value={form.fullName} />
```

Para campos que precisam de mascara (CPF, telefone), manter handlers especificos — mas os campos simples podem compartilhar.

---

## 11. Inconsistencia no padrao de atualizacao de estado

**Arquivo:** `RegisterStep1.tsx`, linha 84 vs demais handlers
**O que acontece:**
```tsx
// Usa spread direto (pode ler estado stale):
setForm({ ...form, birthDate: dateRegex(newValue?.target?.value ?? null) ?? '' });

// Usa functional update (correto):
setForm((prevState) => ({ ...prevState, fullName: newValue?.target?.value ?? '' }));
```
**Por que e um problema:** Quando voce faz `setForm({ ...form, ... })`, o `form` referenciado e o valor do momento em que a funcao foi criada (closure). Se dois updates acontecerem no mesmo ciclo de render, o segundo vai sobrescrever o primeiro porque ambos partiram do mesmo `form`. Com `setForm(prev => ({ ...prev, ... }))`, o React garante que `prev` e sempre o estado mais recente.
**Impacto:** Pode causar perda de dados quando o usuario digita rapido ou quando dois campos sao atualizados em sequencia.
**Como resolver:** Padronizar todos os handlers para usar functional update: `setForm(prev => ({ ...prev, campo: valor }))`.

---

## 12. typeAccessability armazenado como string CSV

**Arquivo:** `RegisterStep4.tsx`, linhas 77-85
**O que acontece:** Multiplas deficiencias selecionadas sao armazenadas como string separada por virgula: `"FISICA,VISUAL,AUDITIVA"`.
**Por que e um problema:**
- Se algum valor futuro contiver virgula, o parse quebra.
- Manipular array e muito mais simples e seguro que fazer split/join/filter em string.
- O backend provavelmente espera um array, nao uma string CSV.

**Impacto:** Fragilidade na logica de selecao/desselecao e possivel incompatibilidade com o backend.
**Como resolver:** Mudar o tipo no DTO de `typeAccessability: string` para `typeAccessability: string[]` e atualizar os handlers:

```tsx
function onAccessibilityTypeChange(value: string, checked: boolean) {
    setForm(prev => ({
        ...prev,
        typeAccessability: checked
            ? [...prev.typeAccessability, value]
            : prev.typeAccessability.filter(t => t !== value),
    }));
}
```

---

## 13. Typo: "Accessability" em vez de "Accessibility"

**Arquivos:** `RegisterStep4.tsx`, `UserDto.ts`
**O que acontece:** O campo se chama `hasAccessability` e `typeAccessability`, mas a grafia correta em ingles e "Accessibility".
**Por que e um problema:** Inconsistencia com padroes da lingua inglesa. Se o backend usa a grafia correta, os campos nao vao bater. Alem disso, outros devs que buscarem por "accessibility" no codigo nao vao encontrar.
**Impacto:** Confusao na manutencao e possivel incompatibilidade com o backend.
**Como resolver:** Renomear para `hasAccessibility` e `typeAccessibility` em todos os arquivos. Usar o "Find and Replace" da IDE para garantir que todas as ocorrencias sejam atualizadas. Alinhar com o backend para usar a mesma grafia.

---

## 14. Senha exposta no alert

**Arquivo:** `CadastroAluno.tsx`, linha 93
**O que acontece:** `JSON.stringify(form)` inclui `password` e `passwordConfirmation` em texto puro no alert.
**Por que e um problema:** Mesmo como codigo temporario, e um habito perigoso. Se alguem estiver compartilhando tela, a senha fica visivel. Se esse codigo escapar para producao, e uma vulnerabilidade.
**Impacto:** Exposicao de senha do usuario.
**Como resolver:** Nunca logar ou exibir senhas. Se precisar debugar o form, filtrar campos sensiveis:

```tsx
const { password, passwordConfirmation, ...safeForm } = form;
console.log(safeForm);
```

---

## 15. Conflito de CSS no grid

**Arquivo:** `app/cadastro/aluno/index.scss`
**O que acontece:** `.register-steps__grid` e definido duas vezes:
- Linha 4-8: `grid-template-columns: repeat(4, 1fr)` (4 colunas)
- Linha 30-37 (dentro do nesting `&__grid`): `grid-template-columns: repeat(3, 1fr)` (3 colunas)

Ambos geram o mesmo seletor CSS `.register-steps__grid`.
**Por que e um problema:** A segunda definicao sobrescreve a primeira. Se a intencao era ter 4 colunas em algum contexto, isso nao funciona. Se a intencao era sempre 3, a primeira definicao e codigo morto que confunde.
**Impacto:** Layout pode nao estar como o esperado. Codigo confuso para quem for ajustar o grid.
**Como resolver:** Decidir quantas colunas o grid deve ter e manter apenas uma definicao. Remover a duplicada.

---

## 16. Tipo das props repetido em todos os steps

**Arquivos:** `RegisterStep1.tsx`, `RegisterStep2.tsx`, `RegisterStep3.tsx`, `RegisterStep4.tsx`
**O que acontece:** Todos os componentes de step declaram o mesmo tipo inline:
```tsx
{ form: UserRegisterPayload; setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>> }
```
**Por que e um problema:** Repeticao. Se o tipo do form mudar, tem que atualizar em 4 lugares.
**Impacto:** Manutencao mais trabalhosa e risco de esquecer de atualizar algum.
**Como resolver:** Criar uma interface compartilhada no DTO ou em um arquivo de types:

```tsx
export interface RegisterStepProps {
    form: UserRegisterPayload;
    setForm: React.Dispatch<React.SetStateAction<UserRegisterPayload>>;
}
```

E usar em todos os steps:
```tsx
export function RegisterStep1({ form, setForm }: RegisterStepProps) { ... }
```

---

## Resumo por prioridade

### Bloqueia merge (corrigir antes de ir para development)
| # | Problema | Risco |
|---|----------|-------|
| 1 | Validacao Step 1 comentada | Dados vazios/invalidos |
| 5 | Enum Scholarship nao bate | Escolaridade nunca salva corretamente |
| 6 | Label renda vs valor do enum | Dado socioeconomico incorreto |

### Deve corrigir (causa bugs ou problemas de seguranca)
| # | Problema | Risco |
|---|----------|-------|
| 2 | window.alert como submit | Nenhuma acao real no cadastro |
| 3 | Throw string para validacao | Bugs silenciados |
| 4 | Estado stale no onForward | Logica fragil |
| 11 | Spread direto vs functional update | Perda de dados |
| 14 | Senha no alert | Exposicao de dados sensiveis |

### Bom corrigir (qualidade e manutencao)
| # | Problema | Risco |
|---|----------|-------|
| 7 | Nome enganoso da variavel | Confusao no codigo |
| 8 | peopleInHouse sem validacao | Dados inconsistentes |
| 9 | Deps faltando no useEffect | Warning de lint / mau habito |
| 10 | Handlers repetitivos | Codigo dificil de manter |
| 12 | CSV em vez de array | Fragilidade |
| 13 | Typo Accessability | Inconsistencia |
| 15 | CSS duplicado | Layout confuso |
| 16 | Props type repetido | Repeticao desnecessaria |
