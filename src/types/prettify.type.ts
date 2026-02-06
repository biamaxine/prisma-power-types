type NativeObjects<T> =
  | unknown[]
  | Set<unknown>
  | Map<unknown, unknown>
  | Iterable<unknown>
  | Promise<unknown>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | Date
  | RegExp
  | Error
  | T;

/**
 * Expande recursivamente as propriedades de um tipo para melhorar a legibilidade em tooltips de IDEs.
 *
 * Este utilitário percorre a estrutura do objeto e "achata" as interseções e propriedades herdadas,
 * facilitando a inspeção visual do tipo final. Tipos nativos e o tipo especificado em `E` são preservados.
 *
 * @template T - O tipo a ser processado/expandido.
 * @template E - Um tipo que, se encontrado, interrompe a expansão recursiva (útil para evitar loops ou preservar definições).
 */
export type Prettify<T, E = never> =
  T extends NativeObjects<E>
    ? T
    : T extends object
      ? { [K in keyof T]: Prettify<T[K], E> }
      : T;
