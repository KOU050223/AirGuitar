import React, { useEffect, useState, useRef } from 'react';
import ModeButton from '../components/ModeButton.jsx';
import { QRCodeSVG } from 'qrcode.react';
import Joycon from '../components/Joycon/Joycon.jsx';

const Preparation = ({ mode, setIsPlaying }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('https://example.com');
  const joyconRef = useRef(null);

  useEffect(() => {
    console.log('Preparation', mode);
    if (mode) {
      console.log(mode);
      setUrl(`${import.meta.env.VITE_PWA_URL}${mode}`);
    }
  }, [mode]);

  const onStartGame = () => {
    setIsPlaying(true);
  };

  // 非同期処理として connectJoyCon を呼び出す
  const handleJoyConConnect = async () => {
    console.log("joyConRef.current:", joyconRef.current);
    try {
      if (joyconRef.current?.connectJoyCon) {
        await joyconRef.current.connectJoyCon();
      } else {
        console.error("connectJoyCon が存在しません。JoyConComponent のレンダリング状態を確認してください。");
      }
    } catch (error) {
      console.error("connectJoyCon 呼び出し時のエラー:", error);
    }
  };

  return (
    <div className='grid grid-cols-1 gap-4 w-1/3 mx-auto'>
      <ModeButton
        buttonName={'スマートフォン接続ボタン'}
        onClick={() => setIsModalOpen(true)}
      />
      <p>スマートフォン接続完了</p>
      <ModeButton 
        buttonName={'Nintendo Switch接続ボタン'}
        onClick={handleJoyConConnect}
      />
      <p>Nintendo Switch接続完了</p>
      <ModeButton 
        buttonName={'エアギターで気持ちよくなろう！'} 
        onClick={onStartGame}
      />

      {/* モーダルウィンドウ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className='aspect-square h-72 w-72 rounded-md bg-white p-4'>
              <QRCodeSVG value={url} size={224} />
              <p>{url}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Joy-Con コンポーネントを参照用にレンダリング（画面上には表示しない） */}
      <div style={{ display: 'none' }}>
        <Joycon ref={joyconRef} />
      </div>
    </div>
  );
};

export default Preparation;
