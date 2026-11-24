import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/standard.css'
import './index.css'
import App from './App.jsx'

// A refresh replays the intro from the top instead of landing mid-scroll.
window.history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
