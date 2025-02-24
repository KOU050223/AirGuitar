import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeButton from '../components/ModeButton.jsx';
import { useDispatch } from 'react-redux';
import { setSettings } from '../features/settings/settingsSlice.js';

const ModeSelect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (mode) => {
    if (mode === '/sound_setting_mode') {
      // テスト用データ（音階名と音声ファイルのパス）
      const soundNames = ['C', 'C(1)', 'E', 'Em', 'F', 'F(1)', 'G', 'G(1)'];
      const soundFiles = [
        'C.wav',
        'C(1).wav',
        'E.wav',
        'Em.wav',
        'F.wav',
        'F(1).wav',
        'G.wav',
        'G(1).wav'
      ];
      // Redux に情報を保存
      dispatch(setSettings({ mode, soundNames, soundFiles }));
      navigate('/playpage');
    } else {
      dispatch(setSettings({mode}));
      navigate('/playpage');
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      <ModeButton
        buttonName={'お手軽モード'}
        mode={'/easy_mode'}
        onClick={() => handleClick('/easy_mode')}
      />
      <ModeButton
        buttonName={'パワーコードモード'}
        mode={'/pawer_code_mode'}
        onClick={() => handleClick('/pawer_code_mode')}
      />
      <ModeButton
        buttonName={'音階設定モード'}
        mode={'/sound_setting_mode'}
        onClick={() => handleClick('/sound_setting_mode')}
      />
    </div>
  );
};

export default ModeSelect;
