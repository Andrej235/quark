export function formatCount(count: number, singular: string, plural: string) {
  const string = count.toString();
  return string.endsWith("1") && !string.endsWith("11")
    ? `1 ${singular}`
    : `${count} ${plural}`;
}
