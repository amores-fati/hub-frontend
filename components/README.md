# 🧩 components/

Contém todos os **componentes reutilizáveis** da aplicação, divididos em duas categorias: componentes **base** e componentes **customizados**.

---

## 📦 `base/`

Componentes **primitivos e genéricos** que formam o design system da aplicação.

- São a fundação visual do projeto: botões, inputs, modais, cards, tipografia, etc.
- Não possuem lógica de negócio
- Altamente configuráveis via props
- Devem ser **consistentes com o design system** definido (cores, espaçamentos, tipografia)

> ⚠️ Alterações em `base/` afetam toda a aplicação. Faça com cautela e documente bem.

---

## 🎨 Componentes customizados (`components/*`)

Tudo fora de `base/` são **componentes de domínio**, construídos **sobre os componentes base** para manter consistência visual.

- Combinam componentes de `base/` com lógica específica de uma funcionalidade
- Podem consumir dados de `services/` ou receber via props
- Devem continuar delegando a aparência aos componentes base, **nunca reescrever estilos fundamentais**

---

## Estrutura de exemplo

```
components/
├── base/
│   ├── Button/
│   │   ├── index.tsx
│   │   └── Button.types.ts
│   ├── Input/
│   └── Modal/
├── UserCard/          # Customizado — usa base/Card internamente
├── FilterBar/         # Customizado — usa base/Input e base/Button
└── DataTable/         # Customizado — usa base/Table
```

## Convenções

- Um componente por pasta, com `index.tsx` como ponto de entrada
- Tipagens em arquivo separado (`ComponentName.types.ts`) quando complexas
- Componentes customizados **não devem replicar** o que já existe em `base/`
