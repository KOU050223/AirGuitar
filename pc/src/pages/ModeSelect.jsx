import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeButton from '../components/ModeButton.jsx';

const ModeSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      <ModeButton buttonName={'お手軽モード'} onClick={() => navigate('/preparation')} />
      <ModeButton buttonName={'パワーコードモード'} onClick={() => navigate('/preparation')} />
      <ModeButton buttonName={'音階設定モード'} onClick={() => navigate('/preparation')} />
      <ModeButton buttonName={'？'} onClick={() => navigate('/mystery-mode')} />
    </div>
  );
};

export default ModeSelect;
