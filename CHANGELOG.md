# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.2.0] - 2026-02-10

### Adicionado

- **Ordenação por Relacionamentos**: Introdução dos tipos `PrismaOrderByRelation` e `OrderByRelation`.
- **Recursividade no OrderBy**: O utilitário `PrismaElementOrderBy` agora permite injetar relacionamentos, possibilitando ordenação aninhada (ex: ordenar Usuário pelo nome do Setor).
- **Segurança de Conflitos**: Lógica que impede que nomes de relações sobrescrevam campos nativos da entidade no `OrderBy`.

### Alterado

- Atualização da assinatura do tipo `PrismaElementOrderBy` para aceitar o parâmetro genérico de relações `R` (opcional).

---

## [1.1.0] - 2026-02-9

### Adicionado

- **Refinamento de Nulidade no Update**: Adicionado o terceiro parâmetro genérico `N` ao utilitário `PrismaElementUpdate`.

- **Controle de Non-Nullable**: Agora é possível transformar campos que aceitam `null` no banco em campos que aceitam apenas o tipo base (mantendo-os opcionais `?`) durante a atualização.
  - **Ex:** `email?: string | null` > `email?: string`.

---

## [1.0.0] - 2026-01-01

### Adicionado

- Lançamento inicial da biblioteca `prisma-power-types`.

- Utilitários base:
  - `PrismaElementCreate`;
  - `PrismaElementUpdate`;
  - `PrismaElementIdentifier`;
  - `PrismaPagination`.

- Utilitários de baixo nível para manipulação de strings e tipos.
  - `Prettify`
  - `PickByPrefix`, `PickBySubstring`, `PickBySuffix`, `PickOneOf`
  - `OmitByPrefix`, `OmitBySubstring`, `OmitBySuffix`
