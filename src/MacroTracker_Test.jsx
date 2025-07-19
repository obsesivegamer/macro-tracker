import { useState } from "react";

// Simple test component to verify basic setup
export default function MacroTracker() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Enhanced Macro Tracker</h1>
      <p>This is a test to verify the basic setup is working.</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Count: {count}
      </button>
      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>✅ React is working</p>
        <p>✅ State management is working</p>
        <p>✅ Event handlers are working</p>
      </div>
    </div>
  );
}
