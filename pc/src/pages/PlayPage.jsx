import React, { useState, useEffect } from 'react';
import Preparation from './Preparation';
import { useLocation } from 'react-router-dom';
import myImage from '../assets/anpu.png';
import myImage2 from '../assets/anpupegu.png';
import videoFile from '../assets/guitarman_animation.mp4'; // 動画をインポート
import videoFile2 from '../assets/me-ta-_animation.mp4'; // 動画をインポート
import '../PlayPage.css'; // スタイルシートをインポート

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
          console.log('MODE:', location.state.mode);
        } else {
            window.location.href = '/modeselect';
        }
    }, [location.state]);

    return (
        <>
            {isPlaying ? (
                <>
                {/* プレイ中画面 */}
                <div className="App">
                    <div className="video-background">
                        <video autoPlay loop muted style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
                            <source src={videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div className="content">
                    <h1 className="title">Play画面</h1>
                    <div className="title"><button onClick={() => setIsPlaying(false)}>Stop</button></div>
                    <div>
                    <video autoPlay loop muted style={{width: '3000px', height: '240px', objectFit: 'cover', zIndex: -1 }}>
                            <source src={videoFile2} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button>
                            <img src={myImage2} style={{ width: '130px', height: '130px', marginRight: '30px', marginBottom: '43px' }} />
                        </button>
                        <button>
                            <img src={myImage2} style={{ width: '130px', height: '130px', marginRight: '30px', marginBottom: '43px' }} />
                        </button>
                        <button>
                            <img src={myImage2} style={{ width: '130px', height: '130px', marginRight: '30px', marginBottom: '43px' }} />
                        </button>
                    </div>
                    <img src={myImage} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%', height: 'auto' }} />
                </div>
                </>
            ) : (<></>)}
            {/* 準備画面 */}
            <Preparation
                mode={mode}
                setIsPlaying={setIsPlaying}
            />
        </>
    );
}

export default PlayPage;
