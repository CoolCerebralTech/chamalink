export default () => ({
  // If PORT is missing, use '3000' as a string, then parse it
  port: parseInt(process.env.PORT || '3000', 10),
  supabase: {
    // If keys are missing, default to empty string to satisfy TS
    // (The Supabase service will throw a real error if they are empty)
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
  },
});
