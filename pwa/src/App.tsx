import './Device/DeviceSensor.js'
import './App.css'
import Guitar from './Guitar.tsx'
import TiltMove from './Device/TiltMove.tsx'
import InertialMove from './Device/InertialMove.tsx'
import SensorFusion from './Device/SensorFusion.tsx'
import Joycon from './Joycon/Joycon.tsx'
import { Routes, Route, Link } from 'react-router-dom'

// ページコンポーネントのインポート
import Connect from './pages/Connect.tsx'
import EasyMode from './pages/EasyMode.tsx'
import PawerCodeMode from './pages/PawerCodeMode.tsx'
import SoundSettingMode from './pages/SoundSettingMode.tsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Connect />} />
        <Route path="/easy_mode" element={<EasyMode />} />
        <Route path="/pawer_code_mode" element={<PawerCodeMode />} />
        <Route path="/sound_setting_mode" element={<SoundSettingMode />} />
      </Routes>
    </>
  )
}

export default App