import './Device/DeviceSensor.js'
import './App.css'
import Guitar from './Guitar.tsx'
import TiltMove from './Device/TiltMove.tsx'
import InertialMove from './Device/InertialMove.tsx'
import SensorFusion from './Device/SensorFusion.tsx'
import Joycon from './Joycon/Joycon.tsx'
import { Routes, Route, Link } from 'react-router-dom'

function App() {

  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/InertialMove">InertialMove</Link>
        </li>
        <li>
          <Link to="/Joycon">Joycon</Link>
        </li>
        <li>
          <Link to="/SensorFusion">SensorFusion</Link>
        </li>
        <li>
          <Link to="/TiltMove">TiltMove</Link>
        </li>
        <li>
          <Link to="/Guitar">Guitar</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/InertialMove" element={<InertialMove />} />
        <Route path="/Joycon" element={<Joycon />} />
        <Route path="/SensorFusion" element={<SensorFusion />} />
        <Route path="/TiltMove" element={<TiltMove />} />
        <Route path="/Guitar" element={<Guitar />} />
      </Routes>
    </div>
  )
}

export default App