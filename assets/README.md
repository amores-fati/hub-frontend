# 🖼️ assets/

Armazena todos os **recursos estáticos** da aplicação: imagens, ícones, fontes, SVGs e outros arquivos que não são código.

## Estrutura sugerida

```
assets/
├── images/       # Imagens gerais (png, jpg, webp)
├── icons/        # Ícones em SVG ou PNG
├── fonts/        # Fontes customizadas (se não carregadas via CDN)
└── svg/          # Ilustrações e vetores
```

## Convenções

- Nomear arquivos em `kebab-case` (ex: `logo-principal.svg`)
- Preferir **SVG** para ícones e ilustrações (escalável, menor tamanho)
- Otimizar imagens antes de adicionar ao repositório (use ferramentas como `squoosh` ou `sharp`)
- Não armazenar arquivos temporários ou de teste aqui
