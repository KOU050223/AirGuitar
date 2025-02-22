import React, { useState } from 'react';
import ModeButton from '../components/ModeButton.jsx'

const AudioSettings = () => {
  const [audioFiles, setAudioFiles] = useState(Array(8).fill(null));

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const newAudioFiles = [...audioFiles];
      newAudioFiles[index] = fileUrl;
      setAudioFiles(newAudioFiles);
    }
  };

  const handleSaveAudio = async () => {
    const formData = new FormData();
    audioFiles.forEach((file, index) => {
      if (file) {
        const audioFile = new Blob([file], { type: 'audio/mpeg' });
        formData.append(`audio-${index + 1}`, audioFile, `${index + 1}.mp3`);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('音声ファイルが保存されました');
      } else {
        alert('音声ファイルの保存に失敗しました');
      }
    } catch (error) {
      console.error('エラー:', error);
      alert('音声ファイルの保存中にエラーが発生しました');
    }
  };

  const handlePlayAudio = (index) => {
    const audioUrl = audioFiles[index];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      alert(`ボタン ${index + 1} に音が設定されていません`);
    }
  };

  return (
    <>
      <h1>音声設定と再生</h1>
      <div className="grid grid-cols-4 gap-4 mx-auto">
        {audioFiles.map((audio, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <input type="file" accept="audio/*" onChange={(e) => handleFileChange(index, e)} />
            <ModeButton
              buttonName={`ボタン ${index + 1} の音を再生`}
              onClick={() => handlePlayAudio(index)}
              className="flex justify-center items-center"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSaveAudio} className="mt-4 bg-blue-500 text-white p-2 rounded">
        音声ファイルを保存
      </button>
    </>
  );
};

export default AudioSettings;
