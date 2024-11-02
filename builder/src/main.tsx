/*
* Author: [oxydien](https://github.com/oxydien)
* License: MIT
* Version: 0.0.0 (Not planing to update this)
* Description: Simple web app to interactevly build JSON for Json2Tkinter
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
