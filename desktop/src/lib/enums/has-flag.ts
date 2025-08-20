export function hasFlag<TEnum extends number>(
  value: TEnum,
  flag: TEnum,
): boolean {
  return (value & flag) === flag;
}
