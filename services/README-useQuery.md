# `useQuery` — Leitura de dados

Use para buscar e cachear dados da API (GET).

---

## Sintaxe

```ts
// services/examples/queries.ts
import { useQuery } from '@tanstack/react-query';
import QUERY_KEYS from '@/utils/contants/queries';
import { examplesApi } from '.';
import { ExamplePayload, ExampleResponse } from '../../../dtos/ExampleDto';
import { PaginatedDto } from '../../../dtos/PaginatedDto';
import { ResponseDto } from '../../../dtos/ResponseDto';

// Busca um registro por ID
export const useGetExample = (exampleId: number) =>
    useQuery({
        enabled: !!exampleId,
        queryKey: [QUERY_KEYS.EXAMPLES, exampleId],
        queryFn: () =>
            examplesApi
                .get(`/${exampleId}`)
                .then((res: ResponseDto<ExampleResponse>) => res.data),
    });

// Busca lista paginada com filtros
export const useGetAllExamples = (payload: ExamplePayload) =>
    useQuery({
        queryKey: [QUERY_KEYS.EXAMPLES, payload.name],
        queryFn: () =>
            examplesApi
                .get('')
                .then(
                    (res) => (res.data as PaginatedDto<ExampleResponse>).data,
                ),
    });
```

**Consumindo na tela:**

```tsx
const { data, isLoading, isError } = useGetExample(exampleId);

const { data: examples } = useGetAllExamples(payload);
```

---

## Propriedades

| Propriedade | Descrição                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------- |
| `queryKey`  | Identifica e agrupa o cache. Deve usar `QUERY_KEYS` + parâmetros que diferenciam a busca  |
| `queryFn`   | Função que executa a requisição e retorna os dados                                        |
| `enabled`   | Condição para a query executar. Use para depender de um valor que pode ser nulo/undefined |

---

## Query Keys

As query keys ficam centralizadas em `utils/constants/queries.ts`, evitando strings soltas:

```ts
// utils/constants/queries.ts
const QUERY_KEYS = {
    EXAMPLES: 'examples',
    USERS: 'users',
} as const;

export default QUERY_KEYS;
```

Sempre combine a constante com os parâmetros que diferenciam a busca:

```ts
[QUERY_KEYS.EXAMPLES][(QUERY_KEYS.EXAMPLES, exampleId)][ // lista geral // registro específico
    (QUERY_KEYS.EXAMPLES, payload.name)
]; // lista filtrada por name
```

> Invalidar `[QUERY_KEYS.EXAMPLES]` afeta todas as queries que começam com essa chave.

---

## Convenções

- Nomear com prefixo `useGet` → `useGetExample`, `useGetAllExamples`
- Localizar em `services/<domínio>/queries.ts`
- Não misturar com `useMutation` no mesmo arquivo
- Sempre usar `QUERY_KEYS` — nunca strings literais na `queryKey`
- Usar `enabled` quando a query depende de um parâmetro que pode não existir ainda
