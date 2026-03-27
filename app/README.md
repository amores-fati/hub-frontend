# Estrutura que encapsula todo front

layout.tsx -- Carrega os estilos globais do projetos. Todas variáveis css serão encontradas neste arquivo.

client.tsx -- Carrega todo os providers que são comuns em todo sistema. Exemplo, provider de roteamento e provider de autenticação

# 📱 telas/

Contém as **telas da aplicação**, organizadas por domínio ou fluxo de navegação.

Cada subpasta representa uma tela ou grupo de telas relacionadas. As telas são compostas a partir dos componentes disponíveis em `components/` e consomem dados via `services/`.

## Convenções

- Uma pasta por tela (ex: `app/login/`, `app/dashboard/`)
- O arquivo principal de cada tela deve se chamar `index.tsx`
- Lógica de negócio e chamadas a serviços ficam nas telas; componentes apenas recebem props
- Navegação entre telas é gerenciada pelo `providers/Route`

## Estrutura de cada tela

```
app/
└── nome-da-tela/
    ├── page.tsx            # Componente principal da tela, apenas para exportar
    ├── NomeTela.tsx        # Arquivo com o código da tela
```

### Cada pasta é uma rota específica

### Será utilizada a arquitetura barrel, onde o arquivo page.tsx, que é obrigatório por pasta, deverá apenas exportar o componente de tela. Dessa forma, facilitará a navegação ao buscar por arquivos.

### Exemplo 1: o arquivo app/page.tsx estará exportando o Home.tsx

### Exemplo 2: o arquivo app/Login/page.tsx estará exportando o Login.tsx
