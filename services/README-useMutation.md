# `useMutation` — Escrita de dados

Use para operações que alteram dados no servidor (POST, PUT, PATCH, DELETE).

---

## Sintaxe

```ts
// services/auth/mutations.ts
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { loginApi } from '../index';
import type { AuthPayload, AuthDto } from '../../dtos/auth.dto';
import type { ResponseDto } from '../../dtos/response.dto';

export const useLoginMutation = (payload: AuthPayload) =>
    useMutation({
        mutationFn: () =>
            loginApi
                .post('', payload)
                .then((res: ResponseDto<AuthDto>) => res.data),
        onError: (data: AxiosError) => {
            if (
                data.response?.status === 403 ||
                data.response?.status === 404
            ) {
                toast.error('Credenciais inválidas. Tente novamente.');
            }
        },
    });
```

**Consumindo na tela:**

```tsx
const { mutate, data } = useLoginMutation(payload);

const handleSubmit = () => {
    mutate();
};
```

---

## Callbacks

Os callbacks `onSuccess` e `onError` podem ser definidos no hook ou no `.mutate()`.

| Local                | Usar para                                              |
| -------------------- | ------------------------------------------------------ |
| Hook (`useMutation`) | Lógica global — toasts de erro, invalidação de cache   |
| `.mutate()`          | Lógica local da tela — redirecionamento, reset de form |

---

## Convenções

- Nomear com sufixo `Mutation` → `useLoginMutation`, `useCreatePedidoMutation`
- Localizar em `services/<domínio>/mutations.ts`
- Não misturar com `useQuery` no mesmo arquivo
