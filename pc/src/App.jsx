import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes ,Route ,Link} from 'react-router-dom'
import ModeSelect from './pages/ModeSelect.jsx'
import WebSocketConnector from './components/WebSocketConnector.jsx'
import Joycon from './components/Joycon/Joycon.jsx'
import Preparation from './pages/Preparation.jsx'
import AudioSettings from './pages/AudioSettings.jsx'
import PlayPage from './pages/PlayPage.jsx'

function App() {

  return (
    <>
      <h1>AirGuitar</h1>
      <li><Link to='/modeselect'>ModeSelect</Link></li>
      <li><Link to='/websocketconnector'>WebSocketConnector</Link></li>
      <Link to='/joycon'>Joycon</Link>
      <li><Link to='/preparation'>Preparation</Link></li>
      <li><Link to='/audiosettings'>AudioSettings</Link></li>

      <Routes>
        {/* <Route path="/" element={<App />} /> */}
        <Route path="/modeselect" element={<ModeSelect />} />
        <Route path="/websocketconnector" element={<WebSocketConnector />} />
        <Route path="/joycon" element={<Joycon />} />
        <Route path="/preparation" element={<Preparation />} />
        <Route path="/audiosettings" element={<AudioSettings />} />
        <Route path="/playpage" element={<PlayPage />} />
      </Routes>
    </>
  )
}

export default App
