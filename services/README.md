# 🌐 services/

Camada de **comunicação com a API**. Centraliza toda a lógica de requisições HTTP, configuração do cliente e gerenciamento de cache de dados assíncronos.

---

## 📄 `index.ts`

Ponto de entrada dos serviços. Instancia o cliente HTTP base apontando para a URL da API configurada via variável de ambiente:

```ts
export const baseApi = createHttpClient(
    (process.env.API_BASE_URL || '') + '/api',
);
```

Serviços específicos de cada domínio devem ser criados a partir de `baseApi` usando `createHttpClient(url, baseApi)`.

---

## 🔧 `http-client.ts`

Fábrica de clientes HTTP baseada no **Axios**.

**O que faz:**
- Cria uma instância Axios com `baseURL`, headers padrão (`Content-Type: application/json`) e serialização de parâmetros com suporte a notação de ponto
- Injeta automaticamente o **token de autenticação** em cada requisição via interceptor (`Authorization: Bearer <token>`)
- Suporta criação de clientes aninhados (ex: `createHttpClient('/users', baseApi)`) que herdam a URL base do pai

**Tipo exportado:**
```ts
export type HttpClient = { url: string } & AxiosInstance;
```

---

## ⚡ `query-client.ts`

Configura o **QueryClient** do React Query com comportamento padrão para toda a aplicação:

| Configuração | Valor | Motivo |
|---|---|---|
| `retry` | até 3x, só em `Network Error` | Evita retentativas em erros de negócio (4xx) |
| `staleTime` | 5 minutos | Reduz requisições desnecessárias para dados estáveis |
| `refetchOnWindowFocus` | `false` | Evita refetches inesperados ao trocar de aba |

---

## Criando um novo serviço

```ts
// services/users/index.ts
import { createHttpClient } from '../http-client';
import { baseApi } from '../index';
import type { UserResponse } from '../../dtos/user.dto';

const usersApi = createHttpClient('/users', baseApi);

export const getUser = (id: string) =>
    usersApi.get<UserResponse>(`/${id}`).then(r => r.data);
```

## Convenções

- Um arquivo ou pasta por domínio (ex: `services/users/`, `services/pedidos/`)
- Funções de serviço retornam `Promise<T>` com o tipo do DTO correspondente
- Não usar `axios` diretamente nas telas — sempre passar por `services/`
