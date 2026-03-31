## Descricao da Mudanca
> Adicione um resumo detalhado do que esta alteracao engloba.

**Link da Task ou Issue:**
- [Task ID](https://jira.ou.trello.com/sua-task)

## Tipo de Mudanca
- [ ] Bugfix - Correcao de bug
- [ ] Feature - Adicao de nova funcionalidade
- [ ] Refactoring - Refatoracao de codigo
- [ ] Documentation - Atualizacao de documentação
- [ ] Chore - Tarefas de manutencao
- [ ] Deploy - Deploy de nova versao
- [ ] Infrastructure - Atualizacao de infraestrutura

## Validacao de Arquitetura
- [ ] Lógica de serviços e consumo de API permanecem na pasta `/services`.
- [ ] DTOs compartilhados ou mapeados com o backend ficam em `/dtos`.
- [ ] Componentes criados são de fato reutilizáveis e ficam em `/components`.
- [ ] Os componentes/páginas construídos são responsivos e fiéis ao protótipo.

## Checklist
- [ ] O código passou no linter local (ESLint/Prettier).
- [ ] O projeto faz o build em sua versão de desenvolvimento corretamente.
- [ ] Sem `console.log` desnecessários deixados para trás.
- [ ] Arquivo `.env.example` foi atualizado se necessário.
- [ ] Documentação foi atualizada (Storybook, README, etc) se necessário.
- [ ] Sem comentários sujos/desnecessários no código final.
