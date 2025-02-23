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
  const soundPath = useSelector((state) => state.settings.soundPath);

  return (
    <>
      {isPlaying ? (
        <div>
          <div className='flex justify-between items-center my-4'>
            <h1 className='text-4xl font-bold'>Play画面</h1>
            <button className='bg-red-500 text-white py-2 px-4 rounded' onClick={() => setIsPlaying(false)}>Stop</button>
          </div>
          <div style={{backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'left', height: '100vh'}}>
            <div>
              <img src={myImage3} className='block mx-auto w-[1500px] h-[200px] mb-10' />
              <button className='bg-blue-500 text-white py-2 px-4 rounded mr-8 mb-10'>
                <img src={myImage2} className='w-[130px] h-[130px]' />
              </button>
              <button className='bg-blue-500 text-white py-2 px-4 rounded mr-8 mb-10'>
                <img src={myImage2} className='w-[130px] h-[130px]' />
              </button>
              <button className='bg-blue-500 text-white py-2 px-4 rounded mr-8 mb-10'>
                <img src={myImage2} className='w-[130px] h-[130px]' />
              </button>
            </div>
            <img src={myImage} className='block mx-auto w-[78%] h-auto' />
          </div>
        </div>
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
