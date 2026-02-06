/**
 * Omite as propriedades de `T` cujas chaves começam com o prefixo `S`.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template S extends `string` - O prefixo a ser correspondido nas chaves.
 */
export type OmitByPrefix<T extends object, S extends string> = {
  [K in keyof T as K extends `${S}${string}` ? never : K]: T[K];
};

/**
 * Omite as propriedades de `T` cujas chaves contêm a substring `S`.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template S extends `string` - A substring a ser buscada nas chaves.
 */
export type OmitBySubstring<T extends object, S extends string> = {
  [K in keyof T as K extends `${string}${S}${string}` ? never : K]: T[K];
};

/**
 * Omite as propriedades de `T` cujas chaves terminam com o sufixo `S`.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template S extends `string` - O sufixo a ser correspondido nas chaves.
 */
export type OmitBySuffix<T extends object, S extends string> = {
  [K in keyof T as K extends `${string}${S}` ? never : K]: T[K];
};

/**
 * Omite as propriedades de `T` onde o tipo `Type` é atribuível ao valor da propriedade.
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template Type O tipo a ser verificado contra as propriedades de T.
 */
export type OmitByType<T extends object, Type> = {
  [K in keyof T as Type extends T[K] ? never : K]: T[K];
};

/**
 * Omite um subconjunto de propriedades `K` de `T` e torna as restantes obrigatórias (Required).
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template K extends `keyof T` - As chaves a serem omitidas.
 */
export type OmitReq<T extends object, K extends keyof T> = Required<Omit<T, K>>;

/**
 * Omite um subconjunto de propriedades `K` de `T` e torna as restantes opcionais (Partial).
 *
 * @template T extends `object` - O tipo do objeto de origem.
 * @template K extends `keyof T` - As chaves a serem omitidas.
 */
export type OmitOpt<T extends object, K extends keyof T> = Partial<Omit<T, K>>;
