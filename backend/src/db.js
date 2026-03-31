// Driver-agnostic query module.
// Call initDb(queryFn) before the first query.
// queryFn signature: (text: string, params?: any[]) => Promise<{ rows: any[] }>

let _queryFn = null;

export function initDb(queryFn) {
  _queryFn = queryFn;
}

export function query(text, params) {
  if (!_queryFn) throw new Error('Database not initialized — call initDb() first');
  return _queryFn(text, params);
}

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    author TEXT,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    category TEXT DEFAULT 'other',
    created_at TIMESTAMPTZ DEFAULT now()
  )
`;
