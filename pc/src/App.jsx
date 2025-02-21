import { useState } from 'react'
import './App.css'
import WebSocketConnector from './components/WebSocketConnector.jsx'
import { BrowserRouter as Router, Route ,Link,Routes} from 'react-router-dom'
import ModeSelect from './pages/ModeSelect.jsx'

function App() {

  return (
    <Router>
      <h1>AirGuitar</h1>
      <li><Link to='/ModeSelect'>ModeSelect</Link></li>
      <li><Link to='/WebSocketConnector'>WebSocketConnector</Link></li>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ModeSelect" element={<ModeSelect />} />
        <Route path="/WebSocketConnector" element={<WebSocketConnector />} />
        {/* <Route path="/xxx" element={<xxx />} /> */}
      </Routes>
    </Router>
  )
}

export default App
