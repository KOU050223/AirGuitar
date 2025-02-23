import { useState } from 'react';
import QRCode from 'react-qr-code'; // QRコード生成用ライブラリ
import ModeButton from '../components/ModeButton.jsx';

const Preparation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qrValue = "https://example.com/room123"; // QRコードの内容（ルームIDとURL）

  return (
    <div className='grid grid-cols-1 gap-4 w-1/3 mx-auto'>
      <ModeButton
        buttonName={'スマートフォン接続ボタン'}
        onClick={() => setIsModalOpen(true)} // ボタンを押したらモーダルを開く
      />
      <p>スマートフォン接続完了</p>
      <ModeButton buttonName={'Nintendo Switch接続ボタン'} />
      <p>Nintendo Switch接続完了</p>
      <ModeButton buttonName={'エアギターで気持ちよくなろう！'} />

      {/* モーダルウィンドウ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-bold">スマートフォン接続用QRコード</p>
            <QRCode value={qrValue} size={200} className="mx-auto my-4" /> {/* QRコード表示 */}
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
    </div>
  );
};

export default Preparation;
