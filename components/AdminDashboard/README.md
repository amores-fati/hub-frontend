# Dashboard Administrativa

## Visão geral

O módulo `components/AdminDashboard` concentra a interface principal da home do perfil `ADMIN`.
Ele recebe um objeto `AdminDashboardDto` já pronto para consumo e organiza os dados em quatro áreas:

- cards de indicadores principais
- gráfico de evolução de cadastros
- gráfico de distribuição por tipo de deficiência
- gráfico de alunos por localidade
- timeline com eventos recentes

O ponto de entrada visual é o componente `AdminDashboard`, que distribui o payload entre os componentes menores e aplica o layout da tela.

## Funcionamento

O fluxo atual da dashboard é:

1. A `app/Home.tsx` verifica o perfil do usuário autenticado.
2. Se o perfil for `ADMIN`, a tela chama `useGetAdminDashboard`.
3. A query usa a chave `ADMIN_DASHBOARD` e busca os dados em `services/api/admin/dashboard/queries.ts`.
4. Hoje a flag `USE_MOCK_ADMIN_DASHBOARD` está como `true`, então a tela consome `getAdminDashboardMock()`.
5. Quando essa flag for alterada para `false`, o consumo passa automaticamente para o endpoint `/admin/dashboard`.

Estados tratados na home:

- `loading`: renderiza `Loading`
- `error`: mostra fallback de integração
- `success`: renderiza o componente `AdminDashboard`

## Estrutura de dados

O contrato da dashboard está em `dtos/AdminDashboardDto.ts`.

### `stats`

Indicadores de topo usados nos cards:

- `totalStudents`: total de alunos cadastrados
- `totalPcd`: total de alunos PCD
- `totalActiveVacancies`: total de vagas ativas

### `enrollmentsByMonth`

Lista de evolução mensal de cadastros.

- `month`: string no formato `YYYY-MM`
- `count`: quantidade de alunos cadastrados no mês

Usado em `EnrollmentChart`.

### `disabilityDistribution`

Lista com a distribuição de alunos por tipo de deficiência.

- `disabilityType`: categoria da deficiência
- `count`: quantidade de alunos naquela categoria

Usado em `StatusDonutChart`.

### `studentsByCity`

Lista com distribuição territorial dos alunos.

- `city`: cidade
- `state`: UF
- `count`: quantidade de alunos naquela localidade

Usado em `CourseCapacityList`.

### `impactTimeline`

Lista cronológica de eventos relevantes do dashboard.

- `date`: data no formato `YYYY-MM-DD`
- `type`: tipo do evento (`placement`, `course_launch`, `partnership`)
- `description`: descrição textual do evento

Usado em `ImpactTimeline`.

## Componentes

### `AdminDashboard.tsx`

Componente agregador da tela. Responsável por:

- montar os cards com base em `data.stats`
- distribuir os demais blocos em grid
- manter a organização visual da dashboard

### `StatCard.tsx`

Renderiza cada indicador de topo com:

- ícone
- texto de apoio
- rótulo
- valor formatado com `toLocaleString('pt-BR')`

### `EnrollmentChart.tsx`

Gráfico de linha com:

- série mensal de cadastros
- labels formatadas via `formatMonthLabel`
- área preenchida e tooltip com total de alunos

### `StatusDonutChart.tsx`

Gráfico de rosca com:

- total central de alunos
- legenda lateral por categoria
- percentual calculado a partir do total

### `CourseCapacityList.tsx`

Gráfico de barras horizontais com:

- ranking de cidades
- label com `cidade - UF`
- quantidade de alunos por localidade

### `ImpactTimeline.tsx`

Lista de eventos recentes com:

- ícone por tipo
- data formatada
- descrição do acontecimento

## Utilitários e pontos importantes

- `Utils.ts` concentra formatação de mês, data e percentual.
- `chartTheme.ts` centraliza cores e tokens visuais usados nos gráficos.
- `services/api/admin/dashboard/mock.ts` serve como base de desenvolvimento enquanto o backend não estiver disponível.
- `services/api/admin/dashboard/index.ts` já aponta para `/admin/dashboard`.
- Como os gráficos usam `EChart`, os testes de componente mockam esse wrapper para validar contrato e conteúdo sem depender do engine do ECharts.

## Como trocar mock por API real

Em `services/api/admin/dashboard/queries.ts`:

```ts
const USE_MOCK_ADMIN_DASHBOARD = true;
```

Para usar o backend, alterar para:

```ts
const USE_MOCK_ADMIN_DASHBOARD = false;
```

## Testes

Foi adicionada cobertura para os componentes de card e charts, focando em comportamento e contrato de renderização.

Cobertura atual:

- `StatCard`: renderização de label, helper, ícone e valor formatado
- `EnrollmentChart`: títulos, labels auxiliares e série enviada ao chart
- `StatusDonutChart`: total, percentuais da legenda e dados do gráfico
- `CourseCapacityList`: labels por cidade/UF e valores enviados ao gráfico

Executar:

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```
