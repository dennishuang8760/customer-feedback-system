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

function FeedbackModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '10px', padding: '28px 32px',
          maxWidth: '560px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '16px',
            background: 'none', border: 'none', fontSize: '20px',
            cursor: 'pointer', color: '#6b7280', lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Feedback Detail</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            {[
              { label: 'Author', value: item.author || '—' },
              { label: 'Category', value: item.category },
              { label: 'Sentiment', value: <Badge sentiment={item.sentiment} /> },
              { label: 'Date', value: new Date(item.created_at).toLocaleString() },
            ].map(({ label, value }) => (
              <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px 12px 8px 0', color: '#6b7280', whiteSpace: 'nowrap', verticalAlign: 'top', fontWeight: 600 }}>{label}</td>
                <td style={{ padding: '8px 0' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '16px' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>Content</div>
          <div style={{
            background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px',
            padding: '12px', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
      <FeedbackModal item={selectedItem} onClose={() => setSelectedItem(null)} />
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
            <tr
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
            >
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
