import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
console.log(import.meta);
const supabase = createClient(
  'https://vuosvpakhkjjnnunxunr.supabase.co',
  import.meta.env.VITE_SB_TOKEN,
);

export default supabase;

export const channel = supabase.channel('user1-location', {
  configs: {
    broadcast: { ack: true },
  },
});

export const usersChannel = supabase.channel('online-users');
