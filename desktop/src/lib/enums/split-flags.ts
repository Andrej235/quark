export function splitFlags<TEnum extends number>(value: TEnum): TEnum[] {
  const result: TEnum[] = [];
  let bit = 1;

  let remaining = value as number;
  while (remaining > 0) {
    if ((remaining & bit) !== 0) {
      result.push(bit as TEnum);
      remaining &= ~bit;
    }
    bit <<= 1;
  }

  return result;
}
