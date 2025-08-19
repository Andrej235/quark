import { hasSingleFlag } from "./has-single-flag";

export function getEnumKeys<TEnum extends number>(
  value: TEnum,
  enumObj: object,
): (keyof typeof enumObj)[] {
  const keys: (keyof typeof enumObj)[] = [];

  for (const [key, enumValue] of Object.entries(enumObj)) {
    if (
      typeof enumValue === "number" &&
      hasSingleFlag(enumValue) &&
      (value & enumValue) === enumValue
    ) {
      keys.push(key as keyof typeof enumObj);
    }
  }

  return keys;
}
