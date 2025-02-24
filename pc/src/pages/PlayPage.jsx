import React, {  useState,  useEffect  } from 'react';;
import Preparation from './Preparation';;
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';;
import myImage from '../assets/anpu.png';
import myImage2 from '../assets/anpupegu.png';
import videoFile from '../assets/guitarman_animation.mp4'; // 動画をインポート
import videoFile2 from '../assets/me-ta-_animation.mp4'; // 動画をインポート
import '../PlayPage.css'; // スタイルシートをインポート

const PlayPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Redux からグローバル状態を参照
  const mode = useSelector((state) => state.settings.mode);
  const soundNames = useSelector((state) => state.settings.soundNames);
  const soundFiles = useSelector((state) => state.settings.soundFiles);
  const soundPath = useSelector((state) => state.settings.soundPath);
  const isSound = useSelector((state) => state.settings.isSound);

  const generateAudioUrl = (fileName) => {
    // この書き方は Vite や webpack で動的にファイルの URL を生成します
    return new URL(`../assets/${fileName}`, import.meta.url).href;
  };

  const playSound = (soundPath) => {
    const audio = new Audio(`${soundPath}`);
    audio.play();
  };

  // isSound が true のときに soundPath の音声を再生する
  useEffect(() => {
    if (isSound && soundPath) {
      // もし soundPath がファイル名だけなら generateAudioUrl を使って URL を作成
      const audioUrl = generateAudioUrl(soundPath);
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error('Audio再生エラー:', err));
    }
  }, [isSound, soundPath]);

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
            ) : null}
      <div style={{display: isPlaying ? 'none' : 'block'}}>
        <Preparation
          mode={mode}
          setIsPlaying={setIsPlaying}
          soundName={soundNames}
          soundFiles={soundFiles}
        />
      </div>
    </>
  );
};

export default PlayPage;
