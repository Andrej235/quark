export function SerializeRegex(regex: RegExp): string {
  return JSON.stringify({
    source: regex.source,
    flags: regex.flags,
  });
}

export function DeserializeRegex(serialized: string): RegExp {
  const { source, flags } = JSON.parse(serialized);
  return new RegExp(source, flags);
}
