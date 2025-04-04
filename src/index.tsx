// src/index.ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ComponentInspector } from './ComponentInspector';

// Re-export for React projects
export { ComponentInspector } from './ComponentInspector';

// Expose a global initializer for script-based usage
declare global {
  interface Window {
    initComponentInspector?: () => void;
  }
}

window.initComponentInspector = function initComponentInspector() {
  const container = document.createElement('div');
  container.id = 'component-inspector-container';
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(
    <ComponentInspector enabled>
      <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
        Your page now has the Component Inspector active.
      </div>
    </ComponentInspector>
  );
};
