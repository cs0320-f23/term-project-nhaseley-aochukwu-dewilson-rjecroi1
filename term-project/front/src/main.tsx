import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.tsx'
import './styles/index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="642860876099-0tmtpntka1f3jhl7nro5e0nnsbi7th2s.apps.googleusercontent.com">

  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </GoogleOAuthProvider>

)
