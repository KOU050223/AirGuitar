import { useState } from 'react'
import './App.css'
import WebSocketConnector from './components/WebSocketConnector.jsx'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ModeSelect from './pages/ModeSelect.jsx'

function App() {

  return (
    <Router>
      <li><Link to='/ModeSelect'>ModeSelect</Link></li>

      <Routes>
        <Route path="/ModeSelect" element={<ModeSelect />} />
        {/* <Route path="/xxx" element={<xxx />} /> */}
      </Routes>
    </Router>
  )
}

export default App
