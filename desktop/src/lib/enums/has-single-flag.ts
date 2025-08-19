export function hasSingleFlag<TEnum extends number>(value: TEnum): boolean {
  return value !== 0 && (value & (value - 1)) === 0;
}
