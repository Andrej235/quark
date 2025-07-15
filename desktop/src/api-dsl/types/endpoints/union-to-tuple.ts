export type Union2Tuple<T> =
  PickOne<T> extends infer U
    ? Exclude<T, U> extends never
      ? [T]
      : [...Union2Tuple<Exclude<T, U>>, U]
    : never;

type PickOne<T> = InferContra<InferContra<Contra<Contra<T>>>>;

type InferContra<T> = [T] extends [(arg: infer I) => void] ? I : never;

type Contra<T> = T extends unknown ? (arg: T) => void : never;
