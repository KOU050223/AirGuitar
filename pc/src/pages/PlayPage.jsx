import React, {useState,useEffect} from 'react'
import Preparation from './Preparation'
import { useLocation } from 'react-router-dom'

const PlayPage = () => {
    const location = useLocation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [data, setData] = useState();
    const [mode, setMode] = useState();    

    useEffect(() => {
        // location.state が存在する場合のみデータを設定
        if (location.state) {
          setData(location.state);
          setMode(location.state.mode);
          console.log(location.state);
          console.log('MODE:',location.state.mode);
        }else {
            window.location.href = '/modeselect';
        }
      }, [location.state]);
    
  return (
    <>
        {isPlaying ? (
            <>
            {/* // プレイ中画面 */}
                <h1>Play画面</h1>
                <button onClick={() => setIsPlaying(false)}>Stop</button>
            </>
        ):(<></>)}
            {/* // 準備画面 */}
            <Preparation
                mode={mode}
                setIsPlaying={setIsPlaying}
            />
    </>
  )
}

export default PlayPage
