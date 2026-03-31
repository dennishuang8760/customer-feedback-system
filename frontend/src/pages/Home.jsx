import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
      <h1>Customer Feedback Demo</h1>
      <p>
        This app collects and analyzes customer feedback in real time. Use the floating
        button to submit feedback, then explore trends on the dashboard.
      </p>
      <Link to="/dashboard" style={{ color: '#4f46e5', fontWeight: 600 }}>
        View Dashboard →
      </Link>
    </div>
  );
}
