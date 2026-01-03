export function loadEnv() {
  const required = ['SUPABASE_URL', 'SUPABASE_KEY'];

  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });
}
