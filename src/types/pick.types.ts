/**
 * Seleciona as propriedades de `T` cujas chaves começam com o prefixo `S`.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template S extends `string` - O prefixo a ser correspondido nas chaves.
 */
export type PickByPrefix<T extends object, S extends string> = {
  [K in keyof T as K extends `${S}${string}` ? K : never]: T[K];
};

/**
 * Seleciona as propriedades de `T` cujas chaves contêm a substring `S`.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template S extends `string` - A substring a ser buscada nas chaves.
 */
export type PickBySubstring<T extends object, S extends string> = {
  [K in keyof T as K extends `${string}${S}${string}` ? K : never]: T[K];
};

/**
 * Seleciona as propriedades de `T` cujas chaves terminam com o sufixo `S`.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template S extends `string` - O sufixo a ser correspondido nas chaves.
 */
export type PickBySuffix<T extends object, S extends string> = {
  [K in keyof T as K extends `${string}${S}` ? K : never]: T[K];
};

/**
 * Cria um tipo onde exatamente uma das chaves em `K` é obrigatória (e não nula),
 * enquanto as outras chaves especificadas são proibidas.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template K extends `keyof T` - As chaves a serem consideradas (padrão: todas as chaves de T).
 */
export type PickOneOf<T extends object, K extends keyof T = keyof T> = {
  [P in K]: Required<Record<P, NonNullable<T[P]>>> &
    Partial<Record<Exclude<K, P>, never>>;
}[K];

/**
 * Seleciona as propriedades de `T` onde o tipo `Type` é atribuível ao valor da propriedade.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template Type O tipo a ser verificado contra as propriedades de T.
 */
export type PickByType<T extends object, Type> = {
  [K in keyof T as Type extends T[K] ? K : never]: T[K];
};

/**
 * Seleciona um subconjunto de propriedades `K` de `T` e as torna obrigatórias (Required).
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template K extends `keyof T` - As chaves a serem selecionadas.
 */
export type PickReq<T extends object, K extends keyof T> = Required<Pick<T, K>>;

/**
 * Seleciona um subconjunto de propriedades `K` de `T` e as torna opcionais (Partial).
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template K extends `keyof T` - As chaves a serem selecionadas.
 */
export type PickOpt<T extends object, K extends keyof T> = Partial<Pick<T, K>>;
