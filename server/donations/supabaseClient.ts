import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseCredentials } from './config';

export class DatabaseConfigError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 503) {
    super(message);
    this.name = 'DatabaseConfigError';
    this.statusCode = statusCode;
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';

export function getSupabaseAdmin(): SupabaseClient {
  const { url, serviceRoleKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) {
    throw new DatabaseConfigError(
      'Supabase PostgreSQL is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server environment variables and run supabase/migrations/001_razorpay_donations.sql.',
      503
    );
  }

  if (cachedClient && cachedUrl === url) {
    return cachedClient;
  }

  cachedUrl = url;
  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cachedClient;
}
