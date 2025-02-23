import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeButton from '../components/ModeButton.jsx';

const ModeSelect = () => {

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      <ModeButton buttonName={'お手軽モード'} mode = {'/easy_mode'} />
      <ModeButton buttonName={'パワーコードモード'} mode = {'/pawer_code_mode'} />
      <ModeButton buttonName={'音階設定モード'} mode = {'/sound_setting_mode'} />
    </div>
  );
};

export default ModeSelect;
