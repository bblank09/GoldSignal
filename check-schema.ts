import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  const { data, error } = await supabase.from('macro_snapshots').select('*').limit(1);
  if (error) {
    console.error('Error fetching macro_snapshots:', error);
  } else {
    console.log('Sample data:', data);
  }
}

checkSchema();
