[![NPM Version](https://img.shields.io/npm/v/prisma-power-types?style=for-the-badge&color=222&labelColor=222&label=Prisma%20Power%20Types)](https://npmjs.com/package/prisma-power-types)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![npm version](https://img.shields.io/npm/v/prisma-power-types?style=for-the-badge&color=0a0)

# Prisma Power Types 🚀

Uma coleção de utilitários de TypeScript de alto nível para transformar de forma prática os modelos do Prisma em DTOs (Data Transfer Objects) seguros, dinâmicos e legíveis.

## 📋 Pré-requisitos

Apesar de esta biblioteca não utilizar diretamente nenhuma dependência, seu uso não faz muito sentido fora de ecossistemas que não utilizem o Prisma. Portanto, você vai precisar:

- **TypeScript 4.5+:** Necessário para o suporte a Template Literal Types.

- **Prisma:** Instalado e gerado no projeto (confira a documentação oficial do [Prisma](https://www.prisma.io/docs/)).

## ✨ Motivação

O Prisma gera tipos excelentes, mas criar interfaces de Criação, Atualização ou Filtros manualmente geralmente resulta em código repetitivo ou tipos "sujos" no IntelliSense. Esta biblioteca fornece utilitários que:

1. **Automatizam metadados:** Removem `id` e _timestamps_ (`created_at`, `updated_at`, `deleted_at`).
2. **Refinam a tipagem:** Transformam campos anuláveis em opcionais ou obrigatórios sob demanda.
3. **Melhoram a DX:** Utilizam o utilitário `Prettify` para que você veja o objeto real ao passar o mouse, e não uma colcha de retalhos de `Omit` e `Pick`.

## 📦 Instalação

```bash
npm i prisma-power-types
# OU
yarn add prisma-power-types
# OU
pnpm add prisma-power-types
```

> **Atenção:** A partir da `v2.0.0`, alguns tipos foram renomeados e novos utilitários foram adicionados. Consulte a seção [Migração da v1 para v2](#-migração-da-v1-para-v2) para mais detalhes.

## 🛠️ Principais Utilitários

Vamos primeiro definir o seguinte `schema` para os exemplos:

```prisma
model Sector {
  id String @id @default(uuid) @db.Uuid
  manager_id String? @unique @db.Uuid

  name String @unique @db.VarChar(100)
  acronym String? @unique @db.VarChar(16)
  is_active Boolean @default(true)

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  deleted_at DateTime?

  users User[] // Relacionamento de 1:N
  manager User? @relation("management", field: [manager_id], reference: [id])
}

enum UserRole {
  administrator
  moderator
  user
}

model User {
  id String @id @default(uuid()) @db.Uuid
  sector_id String @db.Uuid

  cpf String @unique @db.Char(11)
  email String? @unique @db.VarChar(255)
  phone String? @db.VarChar(16)
  password String @db.Char(60)
  role UserRole @default(user)
  is_active Boolean @default(true)

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  deleted_at DateTime?

  sector Sector @relation(fields: [sector_id], reference: [id])
  management Sector? @relation("management") // Relacionamento 1:1
}
```

> Os _timestamps_ precisam terminar com `'_at'` ou `'At'` para que a omissão automática funcione (e.g. 'created_at', 'createdAt'). Particularmente eu prefiro o formato _snake_case_ para Banco de Dados.

> 💡 Aqui definimos `email` como opcional para um sistema de _"soft delete"_. Ao inativar um usuário, tornamos seu email nulo para que possamos reutilizá-lo no registro de novas contas. Isso é útil para empresas que utilizam emails institucionais.

---

### `PrismaElementCreate`

Este utilitário gera um tipo para criação de registros, removendo metadados e permitindo ajustes finos de obrigatoriedade.

```ts
import { PrismaElementCreate } from 'prisma-power-types';
import { User } from 'generated/prisma/client';

/**
 * PrismaElementCreate<T, O, R, P>
 *
 * @template T - O elemento gerado pelo Prisma;
 * @template O - Omite propriedades do elemento. (padrão: never);
 * @template R - Torna propriedades obrigatórias. (padrão: never);
 * @template P - Torna propriedades opcionais. (padrão: never);
 */
export type IUserCreate = PrismaElementCreate<
  User,
  'is_active', // Chaves que DEVEM ser omitidas (opcional)
  'email', // Chaves que DEVEM ser obrigatórias (opcional)
  'role' // Chaves que DEVEM ser opcionais (opcional)
>;

/**
 *  O resultado é:
 *
 *  type IUserCreate = {
 *    cpf: string;
 *    email: string; // Definimos como obrigatório;
 *    phone?: string; // Propriedades `null` são tornadas opcionais;
 *    password: string;
 *    role?: UserRole; // Definimos como opcional;
 *  };
 *
 *  As chaves `id` e os timestamps são omitidas automaticamente.
 */
```

> **OBS:** O `PrismaElementCreate` substitui o tipo `null` por `undefined` de todas as propriedades restantes, tornando-as opcionais.

---

### `PrismaElementIdentifier`

Este utilitário gera um tipo que garante que uma busca seja feita exatamente pelo `id` **OU** por um campo único (como CPF ou email), mas nunca ambos ou nenhum.

```ts
import { PrismaElementIdentifier } from 'prisma-power-types';
import { User } from 'generated/prisma/client';

/**
 * PrismaElementIdentifier<T, K>
 *
 * @template T - O elemento gerado pelo Prisma;
 * @template K - As chaves únicas do elemento;
 */
export type IUserIdentifier = PrismaElementIdentifier<User, 'cpf' | 'email'>;

/**
 * O resultado fica assim:
 *
 * type IUserIdentifier =
 *  | { id: string; cpf?: never; email?: never }
 *  | { id?: never; cpf: string; email?: never }
 *  | { id?: never; cpf?: never; email: string };
 */
```

> 💡 O mais legal aqui é que é totalmente seguro a transformação de `IUserIdentifier` em `Prisma.UserWhereUniqueInput` via _Type Assertion_.

### `PrismaElementMetadata` e `PrismaElementNoMetadata`

Estes utilitários capturam ou omitem os metadados do elemento, respectivamente. Os campos `id`, e _timestamps_ terminados em `'_at'` ou `'At'` são considerados metadados.

```ts
import {
  PrismaElementMetadata,
  PrismaElementNoMetadata,
} from 'prisma-power-types';

const IUserMetadata = PrismaElementMetadata<User>;
const IUserNoMetadata = PrismaElementNoMetadata<User>;

/**
 * type IUserMetadata = {
 *   sector_id: string,
 *   cpf: string,
 *   email: string | null,
 *   phone: string | null,
 *   password: string,
 *   role: UserRole,
 *   is_active: boolean,
 * };
 
 * type IUserNoMetadata = {
 *   id: string,  
 *   created_at: Date,
 *   updated_at: Date,
 *   deleted_at: Date | null,
 * };
*/
```

### `PrismaElementForeignKeys`

Este utilitário captura todas as chaves estrangeiras de um elemento para uma _string literal_.

```ts
import { PrismaElementForeignKeys } from 'prisma-power-types';

type UserFK = PrismaElementForeignKeys<User>;
type SectorFk = PrismaElementForeignKeys<Sector>;

/**
 * type UserFK = 'sector_id';
 * type SectorFK = 'manager_id';
 */
```

---

### `PrismaElementUpdate`

Gera um tipo para atualização onde todos os campos são opcionais por padrão. Permite especificar quais campos não podem ser nulos, removendo o tipo `null` da união, mas mantendo o campo como opcional (?).

```ts
import { PrismaElementUpdate } from 'prisma-power-types';
import { User } from 'generated/prisma/client';

/**
 * PrismaElementUpdate<T, O, N>
 *
 * @template T - Elemento gerado pelo Prisma;
 * @template O - Omite propriedades do elemento (padrão: never);
 * @template N - Torna propriedades não nulas (padrão: never);
 */
export type IUserUpdate = PrismaElementUpdate<
  User,
  'is_active', // Chaves que DEVEM ser omitidas (opcional)
  'email' // Chaves que NÃO DEVEM ser nulas (opcional)
>;

/**
 * O resultado final fica assim:
 *
 * type IUserUpdate = {
 *   cpf?: string;
 *   email?: string; // `null` foi removido, mas permanece opcional.
 *   phone?: string | null;
 *   password?: string;
 *   role?: UserRole;
 * };
 */
```

---

### `PrismaElementOrderBy` & `PrismaElementOrderByRelation`

Este utilitário transforma seus modelos em estruturas de ordenação dinâmicas com suporte à definição de relacionamentos aninhados, permitindo ordenar uma entidade por campos de suas relações, por exemplo, ordenar **Usuários** pelo nome do **Setor**.

1. **`PrismaElementOrderByRelation`**

Mapeia um relacionamento do Prisma associando o nome da propriedade de navegação à sua respectiva entidade e às chaves permitidas para ordenação.

```ts
import { PrismaElementOrderByRelation } from 'prisma-power-types';

/**
 * PrismaElementOrderByRelation<R, T, K>
 *
 * @template R - Nome da propriedade de relacionamento no modelo Prisma;
 * @template T - Tipo da entidade relacionada (PrismaElement);
 * @template K - Chaves da entidade relacionada permitidas para ordenação;
 */
type SectorRelation = PrismaElementOrderByRelation<
  'sector',
  Sector,
  'name' | 'acronym'
>;
```

2. **`PrismaElementOrderBy`**

Define a estrutura de ordenação final. Ele trata automaticamente campos que aceitam `null` usando `SortOrderInput`, garantindo compatibilidade total com o motor do Prisma.

```ts
import {
  PrismaElementOrderBy,
  PrismaElementOrderByRelation,
} from 'prisma-power-types';

/**
 * PrismaElementOrderBy<T, K, R>
 *
 * @template T - Elemento gerado pelo Prisma;
 * @template K - As chaves ordenáveis do elemento;
 * @template R - Ordenação pelas propriedades de um relacionamento (padrão: []);
 */
export type IUserOrderBy = PrismaElementOrderBy<
  User,
  'cpf' | 'email', // Campos locais da tabela User
  [PrismaElementOrderByRelation<'sector', Sector, 'name' | 'acronym'>]
>;

/**
 * O resultado aqui seria:
 * type IUserOrderBy = {
 *   cpf?: SortOrder;
 *   email?: SortOrderInput | SortOrder; // email pode ser null;
 *   sector?: {
 *     name?: SortOrder;
 *     acronym?: SortOrderInput | SortOrder; // acronym pode ser null;
 *   }
 * };
 */
```

> Os tipos `SortOrder`, `NullsOrder` e `SortOrderInput` são gerados pelo Prisma em cada projeto e **não** são exportados pelo pacote principal. Para utilizá-los, importe do subpath `prisma-types` (e.g. `import { SortOrder } from 'prisma-power-types/prisma-types'`).

---

### `PrismaElementPagination` e `PrismaElementPaginationDto`

A interface `PrismaElementPagination` define os parâmetros básicos de paginação:

```ts
export interface PrismaElementPagination {
  page?: number;
  limit?: number;

  get skip(): number;
  get take(): number;
}
```

Para facilitar a integração com frameworks que utilizam DTOs (ex: NestJS com `class-validator`), a biblioteca fornece a classe `PrismaElementPaginationDto` que implementa a interface e já calcula `skip` e `take` automaticamente:

```ts
import { PrismaElementPaginationDto } from 'prisma-power-types';

// Exemplo de uso em um controller (NestJS)
@Get()
async findAll(@Query() pagination: PrismaElementPaginationDto) {
  // As propriedades page e limit são populadas automaticamente
  const users = await this.userService.findAll({
    skip: pagination.skip,
    take: pagination.take,
  });

  return users;
}
```

A classe utiliza valores padrão (`page = 1`, `limit = 10`) que podem ser sobrescritos pelos valores recebidos na requisição.

---

## 🚀 Recomendações de Uso

Para manter um projeto escalável e organizado, recomendo centralizar as transformações de tipos em arquivos dedicados e utilizá-los como contratos para seus DTOs.

### Estrutura de Pastas Sugerida

Organize seus tipos por domínio dentro de cada rota. Isso evita referências circulares e facilita a localização de definições:

```text
src/
└─ routes/
   └─ users/
      ├─ dto/
      │  ├─ users-create.dto.ts
      │  └─ users-update.dto.ts
      ├─ types/
      │  └─ users.types.ts
      ├─ users.service.ts
      └─ users.controller.ts
```

### 1. Centralize as Definições (`users.types.ts`)

Neste arquivo, você consome os modelos do Prisma e exporta as interfaces processadas pela biblioteca:

```ts
import { User } from 'generated/prisma/client';
import { PrismaElementCreate, PrismaElementUpdate } from 'prisma-power-types';

export type IUserCreate = PrismaElementCreate<
  User,
  'is_active',
  'email',
  'role'
>;

export type IUserUpdate = PrismaElementUpdate<User, 'is_active', 'email'>;
```

### 2. Implemente nos DTOs (`users-create.dto.ts`)

Ao implementar os tipos gerados no seu DTO, o TypeScript garantirá que sua classe de validação (no exemplo estou usando o `class-validator`) esteja sempre em sincronia com as regras de negócio definidas nos seus tipos.

```ts
import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword
  Length,
} from 'class-validator';
import { UserRole } from 'generated/prisma/client';
import { IUserCreate } from '../types/users.types';

export class CreateUserDto implements IUserCreate {
  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsEmail()
  email: string; // O TS exigirá que seja obrigatório conforme IUserCreate

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // O TS exigirá que seja opcional conforme IUserCreate
}
```

> **Vantagem desta abordagem:** Se você alterar a obrigatoriedade de um campo no arquivo de tipos, o TypeScript apontará imediatamente um erro no seu DTO, evitando que você esqueça de atualizar as validações de entrada da API.

---

## 🧬 Estrutura Base

Para utilizar os utilitários, seus modelos devem ser compatíveis com a interface `PrismaElement`:

```ts
export interface PrismaElement {
  id: string | number;
  [key: string]: unknown;
}
```

A biblioteca também exporta alguns tipos auxiliares para facilitar a manipulação de metadados e chaves estrangeiras:

- **`PrismaElementMetadata<T>`** – identifica os metadados padrão do Prisma (`id` e campos terminados em `_at`/`At`).
- **`PrismaElementNoMetadata<T, K>`** – omite metadados e chaves adicionais especificadas.
- **`PrismaElementForeignKeys<T>`** – seleciona automaticamente as chaves estrangeiras do modelo (campos com sufixo `Id` ou `_id`).

---

## 🔍 Utilitários de String (Low-level)

### Filtros por Nome de Chave

Utilizam _Template Literal Types_ para filtrar propriedades do objeto dinamicamente.

| Utilitário              | Descrição                                                      |
| ----------------------- | -------------------------------------------------------------- |
| `PickByPrefix<T, S>`    | Seleciona propriedades cujas chaves começam com o prefixo `S`. |
| `PickBySubstring<T, S>` | Seleciona propriedades cujas chaves contêm a substring `S`.    |
| `PickBySuffix<T, S>`    | Seleciona propriedades cujas chaves terminam com o sufixo `S`. |
| `OmitByPrefix<T, S>`    | Remove propriedades cujas chaves começam com o prefixo `S`.    |
| `OmitBySubstring<T, S>` | Remove propriedades cujas chaves contêm a substring `S`.       |
| `OmitBySuffix<T, S>`    | Remove propriedades cujas chaves terminam com o sufixo `S`.    |

> Todos seguem o padrão: `<T extends object, S extends string>`.

```ts
type OnlyTimestamps = PickBySuffix<User, '_at'>;

/**
 * type OnlyTimestamps = {
 *   created_at: Date;
 *   updated_at: Date;
 *   deleted_at: Date | null;
 * }
 */
```

### Filtros por Tipo de Valor

| Utilitário            | Descrição                                                        |
| --------------------- | ---------------------------------------------------------------- |
| `PickByType<T, Type>` | Seleciona propriedades onde o valor é atribuível ao tipo `Type`. |
| `OmitByType<T, Type>` | Remove propriedades onde o valor é atribuível ao tipo `Type`.    |

> Os dois seguem o padrão: `<T extends object, Type>`.

```ts
// Seleciona apenas campos que podem ser nulos

type NullableFields = PickByType<User, null>;

/**
 * type NullableFields = {
 *   email: string | null;
 *   deleted_at: Date | null;
 * }
 */
```

### Utilitários de Composição

| Utilitário        | Descrição                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `PickOneOf<T, K>` | Cria um tipo onde **exatamente uma** das chaves em `K` é obrigatória, proibindo as outras. |
| `PickReq<T, K>`   | Seleciona as chaves `K` e as torna obrigatórias.                                           |
| `PickOpt<T, K>`   | Seleciona as chaves `K` e as torna opcionais.                                              |

---

### `Prettify`

Esse tipo merece um destaque especial por ser o segredo por trás da experiência do desenvolvedor (DX) nesta biblioteca.

Ao trabalhar com utilitários complexos como Omit, Pick e interseções (&), o TypeScript tende a exibir o "processo" e não o "resultado" no IntelliSense da sua IDE. Em vez de ver as propriedades reais do objeto, você acaba vendo algo como `Pick<User, "name"> & { role?: UserRole }`. O Prettify resolve isso "achatando" o tipo em um objeto literal único e legível.

**O que o torna único:**

- **Preservação de Tipos Nativos:** Diferente de versões simplificadas, nossa implementação não tenta "expandir" objetos nativos como `Date`, `Map`, `Set`, `Promise` ou `RegExp`. Isso evita que sua IDE exiba centenas de propriedades internas globais do JavaScript.

- **Recursividade Inteligente:** Ele percorre toda a árvore de objetos, limpando tipos aninhados para que a legibilidade seja mantida em qualquer profundidade.

- **Controle de Exclusão (Template E):** Este é o grande diferencial. O parâmetro genérico `E` permite definir tipos customizados que não devem ser expandidos.

**Exemplo:** Se você tem um tipo `Decimal` (muito comum no Prisma para campos monetários), você pode passar `Prettify<SeuTipo, Decimal>`. Isso instrui o utilitário a tratar o `Decimal` como um valor atômico, impedindo que a IDE tente detalhar sua estrutura interna complexa.

---

## 🛡️ Type Guards para Validação em Tempo de Execução

A partir da `v2.0.0`, a biblioteca disponibiliza _type guards_ para verificar valores de ordenação em tempo de execução. Eles podem ser importados do pacote principal:

```ts
import {
  isPrismaSortOrder,
  isPrismaNullsOrder,
  isPrismaSortOrderInput,
} from 'prisma-power-types';

// Exemplo de validação
if (isPrismaSortOrder(value)) {
  // value é do tipo 'asc' | 'desc'
}
```

Esses guardas são úteis para validar parâmetros recebidos via API antes de passá-los para o Prisma.

---

## 📝 Migração da v1 para v2

### Breaking Changes

- **Renomeação de tipos principais** para padronização com o prefixo `PrismaElement`:
  - `PrismaPagination` → `PrismaElementPagination`
  - `PrismaOrderByRelation` → `PrismaElementOrderByRelation`

- Os nomes antigos foram removidos. Substitua em seu código:

```diff
- import { PrismaPagination, PrismaOrderByRelation } from 'prisma-power-types';
+ import { PrismaElementPagination, PrismaElementOrderByRelation } from 'prisma-power-types';
```

### Novos Recursos

- **Subpath `prisma-types`** para importar `SortOrder`, `NullsOrder` e `SortOrderInput`:

  ```ts
  import { SortOrder } from 'prisma-power-types/prisma-types';
  ```

- **Exportação de novos tipos auxiliares**: `PrismaElementMetadata`, `PrismaElementNoMetadata`, `PrismaElementForeignKeys`.

- **Classe DTO `PrismaElementPaginationDto`** para facilitar paginação em frameworks.

- **Type guards** para validação em tempo de execução.

### Compatibilidade

A biblioteca continua compatível com TypeScript 4.5+ e com os modelos gerados pelo Prisma. A atualização é simples e restrita aos nomes dos tipos mencionados.

---

## 💡 Dicas de Uso

### Otimizando a Visualização (DX)

O TypeScript tende a mostrar tipos complexos como `Pick<User, "name"> & Omit<...>` ao passar o mouse. Todos os utilitários de alto nível desta biblioteca já utilizam o `Prettify` internamente para garantir que você veja a estrutura final do objeto.

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Se você encontrou um bug ou tem uma ideia para um novo utilitário:

1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua feature (`git checkout -b feature/minha-feature`).
3. Faça o **Commit** das alterações (`git commit -m 'Adicionando nova funcionalidade'`).
4. Envie o **Push** para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Distribuído sob a licença MIT.

- Você é livre para utilizar essa biblioteca em projetos pessoais ou empresariais;
- Fique à vontade para modificar os códigos de acordo com suas necessidades;
- Você também pode distribuir versões modificadas desse projeto, só peço que mencione este repositório.

---

Criado por Bianca Maxine.

Se este pacote te ajudou, considere dar uma ⭐️ no [Repositório do GitHub!](https://github.com/biamaxine/prisma-power-types)
