/**
 * Generate a random 6-character alphanumeric invite code
 * Format: ABC123 (3 uppercase letters + 3 numbers)
 */
export function generateInviteCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let code = '';

  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
}

/**
 * Remove formatting from invite code
 * ABC-123 -> ABC123
 */
export function cleanInviteCode(code: string): string {
  return code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
}
