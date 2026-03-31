import React, { useEffect, useState } from 'react';
import api from '../api.js';

const SENTIMENT_COLORS = { positive: '#16a34a', neutral: '#ca8a04', negative: '#dc2626' };

function Badge({ sentiment }) {
  return (
    <span
      style={{
        background: SENTIMENT_COLORS[sentiment] || '#6b7280',
        color: '#fff',
        borderRadius: '4px',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {sentiment}
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes] = await Promise.all([
        api.get('/api/v1/feedback/stats'),
        api.get('/api/v1/feedback', { params: { limit: 100, ...(filter ? { sentiment: filter } : {}) } }),
      ]);
      setStats(statsRes.data);
      setItems(itemsRes.data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
      <h1>Feedback Dashboard</h1>

      {stats && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: stats.total, color: '#4f46e5' },
            { label: 'Positive', value: stats.by_sentiment.positive, color: '#16a34a' },
            { label: 'Neutral', value: stats.by_sentiment.neutral, color: '#ca8a04' },
            { label: 'Negative', value: stats.by_sentiment.negative, color: '#dc2626' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 24px', minWidth: '100px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">All sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <button
          onClick={load}
          disabled={loading}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Author</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Sentiment</th>
            <th style={{ padding: '10px' }}>Content</th>
            <th style={{ padding: '10px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No feedback yet.</td></tr>
          )}
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '10px' }}>{item.author || '—'}</td>
              <td style={{ padding: '10px' }}>{item.category}</td>
              <td style={{ padding: '10px' }}><Badge sentiment={item.sentiment} /></td>
              <td style={{ padding: '10px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.content}
              </td>
              <td style={{ padding: '10px', whiteSpace: 'nowrap', color: '#6b7280' }}>
                {new Date(item.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
