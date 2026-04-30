import { fetchNewsFromRSS } from './lib/services/news-fetcher';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Fetching news from RSS...');
  const articles = await fetchNewsFromRSS();
  console.log('Total fetched:', articles.length);
  
  if (articles.length === 0) {
    console.log('No gold-relevant articles found!');
    return;
  }
  
  console.log('\nSample articles:');
  for (const a of articles.slice(0, 3)) {
    console.log(`- [${a.source}] ${a.title}`);
  }
  
  console.log('\nTrying to insert first article into Supabase...');
  const article = articles[0];
  const { data, error } = await supabase.from('articles').upsert(
    {
      title:        article.title,
      source:       article.source,
      url:          article.url,
      published_at: article.published_at,
      category_id:  article.category_id,
      factors:      article.factors,
      raw_excerpt:  article.raw_excerpt,
    },
    { onConflict: 'url', ignoreDuplicates: false }
  ).select();
  
  if (error) {
    console.error('Insert error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Insert success:', data);
  }
  
  // Check existing articles
  const { data: existing, error: selErr } = await supabase.from('articles').select('id, title, url, published_at').limit(5);
  if (selErr) {
    console.error('Select error:', selErr);
  } else {
    console.log('\nExisting articles in DB:', existing?.length);
    existing?.forEach(a => console.log(`  - ${a.title?.substring(0,50)}`));
  }
}

main().catch(console.error);
