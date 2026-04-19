'use server';

import { ADMIN_KEY_ENV_NAME } from '../lib/constants';

/**
 * Verifies the admin key against the server-side environment variable.
 */
export async function verifyAdminKey(key: string): Promise<boolean> {
  const secret = process.env[ADMIN_KEY_ENV_NAME] || 'admin';
  return key === secret;
}
