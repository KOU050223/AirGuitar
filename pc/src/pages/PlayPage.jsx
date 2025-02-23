import React, { useState, useEffect } from 'react';
import Preparation from './Preparation';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PlayPage = () => {
  const location = useLocation();
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
          <button onClick={() => setIsPlaying(false)}>Stop</button>
        </div>
      ) : null}
      <Preparation
        mode={mode}
        setIsPlaying={setIsPlaying}
        soundName={soundNames}
        soundFiles={soundFiles}
      />
      <div>
        <p>Mode: {mode}</p>
        <p>Sound Names: {soundNames.join(', ')}</p>
        <p>Sound Files: {soundFiles.join(', ')}</p>
      </div>
    </>
  );
};

export default PlayPage;
