import { useState } from 'react';
import ModeButton from '../components/ModeButton.jsx';
import { QRCodeSVG } from 'qrcode.react';
import Joycon from '../components/Joycon/Joycon.jsx';

const Preparation = ({ mode, setIsPlaying }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <p className="text-xl font-bold">HalloWould</p>
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
