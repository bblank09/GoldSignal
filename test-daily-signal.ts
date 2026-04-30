import { runDailySignal } from './lib/services/daily-signal';

async function test() {
  try {
    console.log('Generating daily signal...');
    const signal = await runDailySignal(3300);
    console.log('Success:', JSON.stringify(signal, null, 2));
  } catch (err) {
    console.error('Error generating daily signal:', err);
  }
}

test();
