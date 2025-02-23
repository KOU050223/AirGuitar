import React, { useEffect, useState, useRef, use } from 'react';
import ModeButton from '../components/ModeButton.jsx';
import { QRCodeSVG } from 'qrcode.react';
import Joycon from '../components/Joycon/Joycon.jsx';

const Preparation = ({ mode, setIsPlaying, soundName, soundFiles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectPWA, setIsConnectPWA] = useState(false);
  const [isConnectJoycon, setIsConnectJoycon] = useState(false);
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
    if(isConnectJoycon && isConnectPWA){
      setIsPlaying(true);
    }
  };

  const handlePWAConnect = async () => {
    setIsConnectPWA(true);
    setIsModalOpen(true);
  };

  // 非同期処理として connectJoyCon を呼び出す
  const handleJoyConConnect = async () => {
    console.log("joyConRef.current:", joyconRef.current);
    try {
      if (joyconRef.current?.connectJoyCon) {
        await joyconRef.current.connectJoyCon();
        setIsConnectJoycon(true);
      } else {
        console.error("connectJoyCon が存在しません。Joycon コンポーネントのレンダリング状態を確認してください。");
      }
    } catch (error) {
      console.error("connectJoyCon 呼び出し時のエラー:", error);
    }
  };


  return (
    <div className='grid grid-cols-1 gap-4 w-1/3 mx-auto'>
      <ModeButton
        buttonName={'スマートフォン接続ボタン'}
        onClick={handlePWAConnect}
      />
      {isConnectPWA ? <p>スマートフォン接続完了</p> : <p>スマートフォン未接続</p>}
      <ModeButton 
        buttonName={'Nintendo Switch接続ボタン'}
        onClick={handleJoyConConnect}
      />
      {isConnectJoycon ? <p>Nintendo Switch接続完了</p> : <p>Nintendo Switch未接続</p>}
      <ModeButton 
        buttonName={'エアギターで気持ちよくなろう！'} 
        onClick={onStartGame}
      />

      {/* モーダルウィンドウ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-bold">スマートフォン接続用QRコード</p>
            <QRCodeSVG value={url} size={200} className="mx-auto my-4" />
            <p>{url}</p>
            <p className="text-sm text-gray-600">スマホでQRコードをスキャンしてください</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Joycon コンポーネントを参照用にレンダリング（画面上には表示しない） */}
      <div style={{ display: 'none' }}>
        {/* mode, soundName, soundFiles を Joycon に渡す */}
        <Joycon ref={joyconRef} mode={mode} soundName={soundName} soundFiles={soundFiles} />
      </div>
    </div>
  );
};

export default Preparation;
