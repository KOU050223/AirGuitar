import React, {useState,useEffect} from 'react'
import Preparation from './Preparation'
import { useLocation } from 'react-router-dom'
import myImage from '../assets/anpu.png';
import myImage2 from '../assets/anpupegu.png';
import myImage3 from '../assets/me-ta-.jpg';
import background from '../assets/backgroundpicture.png';

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
                <div><button onClick={() => setIsPlaying(false)}>Stop</button></div>
                <div style={{backgroundImage: `url(${background})`,backgroundSize: 'cover',backgroundPosition: 'left',height: '100vh',}}>
                    <div>
                        <img src={myImage3} style={{display: 'block',marginLeft: 'auto',marginRight: 'auto',width :'1500px', height: '200px',marginBottom: '40px'}} />
                        <button>
                            <img src={myImage2} style={{ width: '130px', height: '130px', marginRight: '30px' ,marginBottom: '40px'}} />
                        </button>
                        <button>
                            <img src={myImage2} style={{ width: '130px', height: '130px', marginRight: '30px' ,marginBottom: '40px'}} />
                        </button>
                        <button>
                            <img src={myImage2} style={{ width: '130px', height: '130px', marginRight: '30px' ,marginBottom: '40px'}} />
                        </button>
                    </div>
                    <img src={myImage} style={{display: 'block',marginLeft: 'auto',marginRight: 'auto',width: '78%',height: 'auto'}}/>
                </div>
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
