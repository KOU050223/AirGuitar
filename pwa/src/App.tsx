import './Device/DeviceSensor.js'
import './App.css'
import { Routes, Route } from 'react-router-dom'

// ページコンポーネントのインポート
import Connect from './pages/Connect.tsx'
import EasyMode from './pages/EasyMode.tsx'
import PawerCodeMode from './pages/PawerCodeMode.tsx'
import SoundSettingMode from './pages/SoundSettingMode.tsx'

function App() {

  return (
    <>
      {/* ルーティングの設定 */}
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