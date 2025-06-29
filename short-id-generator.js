const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function generateShortId(length = 7): string {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return str;
}
