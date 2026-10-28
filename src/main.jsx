import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted interface fonts (never from Google's servers: GDPR)
import '@fontsource-variable/fraunces'
import '@fontsource-variable/dm-sans'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
