// Entry labels in the redraft end with a colon, either inside or after the bold text.
export function isGlossaryEntry(label: string, followingText: string): boolean {
  return /:\s*$/.test(label) || /^\s*:/.test(followingText);
}

export function matchesGlossaryQuery(entry: string, query: string): boolean {
  return entry.toLowerCase().includes(query.trim().toLowerCase());
}
