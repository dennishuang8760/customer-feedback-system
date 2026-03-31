import React, { useState } from 'react';
import api from '../api.js';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ content: '', author: '', category: 'other' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/v1/feedback', form);
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setForm({ content: '', author: '', category: 'other' });
      }, 1500);
    } catch {
      setError('Failed to submit. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}
      >
        Feedback
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              width: '360px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Share Feedback</h2>
            {submitted ? (
              <p style={{ color: '#16a34a', fontWeight: 600 }}>Thanks for your feedback!</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea
                  required
                  placeholder="Your feedback..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
                />
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                >
                  <option value="bug">Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="praise">Praise</option>
                  <option value="other">Other</option>
                </select>
                {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
