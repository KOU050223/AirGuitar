import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeButton from '../components/ModeButton.jsx';

const ModeSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      <ModeButton buttonName={'お手軽モード'} mode = {'/easy_mode'}onClick={() => navigate('/preparation')} />
      <ModeButton buttonName={'パワーコードモード'} mode = {'/pawer_code_mode'}onClick={() => navigate('/preparation')} />
      <ModeButton buttonName={'音階設定モード'} mode = {'/sound_setting_mode'} onClick={() => navigate('/preparation')} />
    </div>
  );
};

export default ModeSelect;
