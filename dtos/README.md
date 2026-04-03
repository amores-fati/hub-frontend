# 📋 dtos/

Contém os **Data Transfer Objects (DTOs)** da aplicação — definições TypeScript que tipam os dados trafegados entre o frontend e a API.

## O que é um DTO?

Um DTO é uma interface ou type que representa a **forma exata dos dados** em uma requisição ou resposta. Ele desacopla a tipagem da lógica de negócio, tornando o código mais seguro e legível.

## Estrutura sugerida

```
dtos/
├── user.dto.ts         # Tipagens relacionadas a usuário
├── auth.dto.ts         # Tipagens de autenticação (login, token, etc.)
└── produto.dto.ts      # Exemplo de entidade de domínio
```

## Convenções

- Nomear arquivos com sufixo `.dto.ts`
- Separar DTOs de **request** e **response** quando diferirem:

    ```ts
    // Dado enviado para a API
    export type CreateUserRequest = {
        name: string;
        email: string;
    };

    // Dado retornado pela API
    export type CreateUserResponse = {
        id: string;
        name: string;
        email: string;
        createdAt: string;
    };
    ```

- DTOs **não contêm lógica**, apenas tipos
- Importar DTOs nos `services/` para tipar as chamadas de API
