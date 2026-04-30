import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
  // Querying pg_attribute to get column names for macro_snapshots
  const { data, error } = await supabase.rpc('inspect_table', { table_name: 'macro_snapshots' });
  if (error) {
    // If RPC doesn't exist, try a simple select with an invalid column to see the error message which might list valid columns
    const { error: err2 } = await supabase.from('macro_snapshots').select('non_existent_column').limit(1);
    console.log('Error message with hints:', err2?.message);
  } else {
    console.log('Columns:', data);
  }
}

inspect();
