import { fetchMacroSnapshot } from './lib/services/macro';

async function test() {
  try {
    console.log('Fetching macro snapshot...');
    const macro = await fetchMacroSnapshot();
    console.log('Success:', JSON.stringify(macro, null, 2));
  } catch (err) {
    console.error('Error fetching macro:', err);
  }
}

test();
