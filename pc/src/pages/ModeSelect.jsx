import React from 'react'
import ModeButton from '../components/ModeButton.jsx'

// モードセレクトをするページです
// ここでモードを選択することで、PCのモードを変更することができます
// [お手軽・パワーコード・設定・？]モード実装予定
const ModeSelect = () => {
  return (
    <div className='grid grid-cols-2 gap-4'>
        <ModeButton
          buttonName={'お手軽'}
        />
        <ModeButton
          buttonName={'パワーコード'}
        />
        <ModeButton
          buttonName={'設定'}
        />
        <ModeButton
          buttonName={'？'}
        />
    </div>
  )
}

export default ModeSelect
