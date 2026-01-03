import { randomBytes } from 'crypto';

export class CodeUtil {
  /**
   * Generates a 5-character friendly code for members (e.g., "K9X2A")
   * Uses uppercase only to avoid confusion.
   */
  static generateShortCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 to avoid confusion
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a secure, long random string for the Admin URL.
   * e.g., "a3f12...9z"
   */
  static generateAdminToken(): string {
    return randomBytes(16).toString('hex'); // 32 characters long
  }
}
