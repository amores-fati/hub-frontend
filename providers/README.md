# ⚙️ providers/

Contém os **providers de contexto global** da aplicação. Cada provider encapsula um domínio de estado ou comportamento que precisa estar disponível em toda a árvore de componentes.

---

## 🔐 `Auth/`

Gerencia o **estado de autenticação** do usuário.

Responsabilidades:

- Armazenar e expor o token de acesso e os dados do usuário autenticado
- Prover funções de `login`, `logout` e renovação de sessão
- Proteger rotas que exigem autenticação (em conjunto com `Route`)
- Persistir o token via `utils/stores/auth` (usado também pelo `http-client`)

Uso:

```tsx
const { user, login, logout } = useAuth();
```

---

## 🛣️ `Route/`

Gerencia o **controle de navegação e proteção de rotas**.

Responsabilidades:

- Redirecionar usuários não autenticados para a tela de login
- Redirecionar usuários autenticados para fora de rotas públicas (ex: login)
- Centralizar a lógica de guards de rota, evitando duplicação nas telas

Uso:

```tsx
// Aplicado no layout.tsx para proteger toda a aplicação
<RouteProvider>{children}</RouteProvider>
```

---

## Como os providers são compostos

Todos os providers são montados em `app/client.tsx`, na ordem correta de dependência:

```tsx
<AuthProvider>
    <RouteProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </RouteProvider>
</AuthProvider>
```
