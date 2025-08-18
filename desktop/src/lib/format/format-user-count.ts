export function formatUserCount(count: number) {
  const string = count.toString();
  return string.endsWith("1") && !string.endsWith("11")
    ? "1 user"
    : `${count} users`;
}
