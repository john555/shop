import * as argon2 from 'argon2';

/**
 * Hash the password
 * @param password
 * @returns Promise<string>
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

/**
 * Check if the password is correct
 * @param password
 * @param hashedPassword
 * @returns
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return argon2.verify(hashedPassword, password);
}
