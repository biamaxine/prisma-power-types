# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2026-07-20

### Breaking Changes

- **Renomeação de tipos principais** para padronização com o prefixo `PrismaElement`:
  - `PrismaPagination` → `PrismaElementPagination`
  - `PrismaOrderByRelation` → `PrismaElementOrderByRelation`

- **Remoção dos nomes antigos**: Os tipos `PrismaPagination` e `PrismaOrderByRelation` foram removidos. Utilize os novos nomes (`PrismaElementPagination` e `PrismaElementOrderByRelation`).

### Adicionado

- **Exportação dos tipos de ordenação do Prisma** através do subpath `prisma-types`:
  - `SortOrder`
  - `NullsOrder`
  - `SortOrderInput`
  - Agora podem ser importados via `import { SortOrder } from 'prisma-power-types/prisma-types';`.

- **Exportação de novos tipos auxiliares**:
  - `PrismaElementMetadata` – identifica os metadados padrão do Prisma (`id` e campos terminados em `_at`/`At`).
  - `PrismaElementNoMetadata` (antes `OmitElementMetadatas`) – omite metadados e chaves adicionais (não era exportado anteriormente).
  - `PrismaElementForeignKeys` – seleciona automaticamente as chaves estrangeiras do modelo (campos com sufixo `Id` ou `_id`).

- **Type guards para validação em tempo de execução**:
  - `isPrismaSortOrder`
  - `isPrismaNullsOrder`
  - `isPrismaSortOrderInput`

- **Classe DTO de paginação**:
  - `PrismaElementPaginationDto` – implementa a interface `PrismaElementPagination` com valores padrão (`page = 1`, `limit = 10`) e getters `skip`/`take` prontos para uso em consultas Prisma.

### Alterado

- **Reorganização interna do código** em arquivos modulares para melhor manutenção:
  - Tipos agora separados em `prisma.element-create.type.ts`, `prisma.element-update.type.ts`, `prisma.element-identifier.type.ts`, `prisma.element-order-by.type.ts`, `prisma.element-pagination.type.ts`, `prisma.element-metadata.type.ts`, entre outros.

### Migração da v1.x para v2.0.0

- Substitua `PrismaPagination` por `PrismaElementPagination`.
- Substitua `PrismaOrderByRelation` por `PrismaElementOrderByRelation`.
- Para importar `SortOrder`, `NullsOrder` ou `SortOrderInput`, utilize o novo subpath:

```ts
import {
  SortOrder,
  NullsOrder,
  SortOrderInput,
} from 'prisma-power-types/prisma-types';
```

---

## [1.2.0] - 2026-02-10

### Adicionado

- **Ordenação por Relacionamentos**: Introdução dos tipos `PrismaOrderByRelation` e `OrderByRelation`.
- **Recursividade no OrderBy**: O utilitário `PrismaElementOrderBy` agora permite injetar relacionamentos, possibilitando ordenação aninhada (ex: ordenar Usuário pelo nome do Setor).
- **Segurança de Conflitos**: Lógica que impede que nomes de relações sobrescrevam campos nativos da entidade no `OrderBy`.

### Alterado

- Atualização da assinatura do tipo `PrismaElementOrderBy` para aceitar o parâmetro genérico de relações `R` (opcional).

---

## [1.1.0] - 2026-02-09

### Adicionado

- **Refinamento de Nulidade no Update**: Adicionado o terceiro parâmetro genérico `N` ao utilitário `PrismaElementUpdate`.

- **Controle de Non-Nullable**: Agora é possível transformar campos que aceitam `null` no banco em campos que aceitam apenas o tipo base (mantendo-os opcionais `?`) durante a atualização.
  - **Ex:** `email?: string | null` → `email?: string`.

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
