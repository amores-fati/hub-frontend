# Exportação de relatório (PDF) na tela /alunos

## Objetivo do documento

Este documento é **um snapshot do fluxo atual** de exportação para PDF na página “Gestão de Alunos” (`/alunos`).

## O que significa “exportar PDF” no momento atual

Não existe geração de PDF via lib (ex.: jsPDF) nem via backend.

O PDF é obtido via **impressão do navegador**:

1. Abre uma nova janela/aba (`window.open`).
2. Injeta um HTML completo via `printWindow.document.write(...)` (inclui `<style>` inline).
3. Chama `printWindow.print()`.
4. Usuário escolhe “Salvar como PDF” no diálogo de impressão.

Função responsável: `exportStudentsToPdf(...)` em [AdminStudents.tsx](AdminStudents.tsx#L289-L378).

## Entradas de UI

### 1) Exportar todos alunos

- Botão no header: [AdminStudents.tsx](AdminStudents.tsx#L683-L700)
- Handler: `handleExportAll` em [AdminStudents.tsx](AdminStudents.tsx#L508-L525)

**Passo a passo do handler (fluxo atual):**

1. Abre a janela (`window.open('', '_blank', 'width=1120,height=840')`).
2. Seta `isExporting = true` (UI mostra loader e desabilita o botão).
3. Busca todos os alunos com filtros aplicados (`getStudentsForExport(filters)`).
4. Se a lista vier vazia: fecha janela + toast info.
5. Caso contrário: chama `exportStudentsToPdf(printWindow, students, 'Gestão de Alunos')`.
6. Em erro: fecha janela + toast error.
7. Sempre: `isExporting = false` no `finally`.

### 2) Exportar selecionados

- Barra de ações em massa aparece quando há seleção: [AdminStudents.tsx](AdminStudents.tsx#L814-L847)
- Clique chama `handleExportSelected(Object.values(selectedStudents) ...)`: [AdminStudents.tsx](AdminStudents.tsx#L819-L831)
- Handler: `handleExportSelected` em [AdminStudents.tsx](AdminStudents.tsx#L406-L421)

**Passo a passo do handler (fluxo atual):**

1. Se `selectedStudents.length === 0`: toast info e aborta.
2. Abre a janela (`window.open('', '_blank', 'width=1120,height=840')`).
3. Chama `exportStudentsToPdf(printWindow, selectedStudents, 'Gestão de Alunos')` dentro de `try/catch`.
4. Em erro: fecha janela + toast error.

**Observação importante:** exportação de selecionados **não faz re-fetch**; exporta os objetos armazenados no store.

## Fonte de dados usada na exportação

### Selecionados: store da tabela

Na tela, a seleção vem de `useTableStore((state) => state.selectedRows)`.

Estrutura do store: `selectedRows: { [key: ID]: T }` em [stores/TableStoreProvider.tsx](../../stores/TableStoreProvider.tsx#L33-L40).

Na UI, o export usa `Object.values(selectedStudents)` para obter a lista (ver clique em [AdminStudents.tsx](AdminStudents.tsx#L819-L831)).

### Todos: função `getStudentsForExport(filters)` (pagina as requisições)

Implementação: [AdminStudents.tsx](AdminStudents.tsx#L380-L404)

**Lógica atual:**

- Requisição 1: `getAdminStudents({ ...filters, page: 1, limit: 100 })`
- Calcula `totalPages = Math.ceil(firstPage.total / firstPage.limit)`
- Se `totalPages > 1`: busca páginas 2..N em paralelo (`Promise.all`), mantendo `limit = firstPage.limit`.
- Retorna array final: `[firstPage, ...pages].flatMap((page) => page.data)`

**Contrato esperado por `getStudentsForExport`:**

- `firstPage.total: number`
- `firstPage.limit: number`
- `firstPage.data: AdminStudentDto[]`

**Estado atual do arquivo:** `getStudentsForExport` chama `getAdminStudents(...)`, mas **não existe import/definição** de `getAdminStudents` neste módulo (ver chamadas em [AdminStudents.tsx](AdminStudents.tsx#L380-L404)).

### API usada pela listagem da tela (contexto do endpoint)

A tabela em si usa React Query via `useGetAdminStudents(payload)` em [services/api/admin/students/queries.ts](../../services/api/admin/students/queries.ts#L12-L36):

- Endpoint: `GET /students/filter` (base `adminStudentsApi = '/students'`)
- Query params: `page`, `limit`, `search`, `city[]`, `disabilityType[]`, `courseTypes[]`, `sortBy`, `sortOrder`
- Serialização de arrays: `qs.stringify(..., { arrayFormat: 'repeat' })`

## Quais filtros entram na exportação de “todos”

O handler `handleExportAll` usa o estado `filters` (não os valores “draft” dos selects). Trecho: [AdminStudents.tsx](AdminStudents.tsx#L508-L525).

Como `filters` é preenchido:

- `handleApplyAllFilters` em [AdminStudents.tsx](AdminStudents.tsx#L527-L537)
- Campos usados: `search`, `courseTypes`, `city`, `disabilityType`

Existe `buildFiltersSummary(filters)` em [AdminStudents.tsx](AdminStudents.tsx#L256-L287), porém **não é utilizado** no PDF atual.

## Notas do estado atual (somente fatos observáveis no código)

- O PDF **não inclui** “Filtros aplicados” (apesar de existir `buildFiltersSummary`).
- A célula “PCD” no PDF usa `disabilityLabels[student.disabilityType]`; se `disabilityType` não bater com as chaves do map, pode renderizar vazio/`undefined`.
- O HTML do relatório é montado por interpolação direta (não há escape de caracteres especiais em `fullName`, `email`, etc.).
- Resultado visual (margens, escala, paginação) depende do diálogo de impressão do navegador.
