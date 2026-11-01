export function matchesGlossaryQuery(entry: string, query: string): boolean {
  return entry.toLowerCase().includes(query.trim().toLowerCase());
}
