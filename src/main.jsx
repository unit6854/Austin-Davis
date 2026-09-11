import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/fonts.css';
import './styles/base.css';
import App from './App.jsx';

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById('root');

/* Every route is prerendered to real HTML at build time (scripts/prerender.js),
   so in production there is already markup here to take over rather than
   replace. `npm run dev` serves an empty root, and falls back to rendering. */
if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
