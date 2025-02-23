import React, { useState, useEffect } from 'react';
import Preparation from './Preparation';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import myImage from '../assets/anpu.png';
import myImage2 from '../assets/anpupegu.png';
import myImage3 from '../assets/me-ta-.jpg';
import background from '../assets/backgroundpicture.png';

const PlayPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Redux からグローバル状態を参照
  const mode = useSelector((state) => state.settings.mode);
  const soundNames = useSelector((state) => state.settings.soundNames);
  const soundFiles = useSelector((state) => state.settings.soundFiles);

  return (
    <>
      {isPlaying ? (
        <div>
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
        </div>
      ) : null}
      <Preparation
        mode={mode}
        setIsPlaying={setIsPlaying}
        soundName={soundNames}
        soundFiles={soundFiles}
      />
    </>
  );
};

export default PlayPage;
