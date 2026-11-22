// Deliberately loose: MailerLite does the real validation, this only rejects
// obvious typos before we spend an API call on them.
export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
