import { useEffect, useState } from 'react';
import ModeButton from '../components/ModeButton.jsx';
import { QRCodeSVG } from 'qrcode.react';

const Preparation = ({mode}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  useEffect(() => {
    console.log('Preparation', mode);
    if (mode) {
      console.log(mode);
      setUrl(`${import.meta.env.VITE_PWA_URL}${mode}`);
    }
  }, [mode]);
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
    </div>
  );
};

export default Preparation;
