export async function getValueFromCookie(_key: string): Promise<string | undefined> {
  return undefined;
}

// biome-ignore lint/suspicious/noEmptyBlockStatements: no-op stub for static export
export async function setValueToCookie(_key: string, _value: string): Promise<void> {}

export async function getPreference<T extends string>(_key: string, _allowed: readonly T[], fallback: T): Promise<T> {
  return fallback;
}
