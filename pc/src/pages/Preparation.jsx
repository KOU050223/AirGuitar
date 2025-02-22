import React from 'react'
import ModeButton from '../components/ModeButton.jsx'

const preparation = () => {
  return (
    <div className='grid grid-cols-1 gap-4 w-1/3 mx-auto'>
        <ModeButton
          buttonName={'スマートフォン接続ボタン'}
        />
        <p>スマートフォン接続完了</p>
        <ModeButton
          buttonName={'Nintendo Swith接続ボタン'}
        />
        <p>Nintendo Swith接続完了</p>
        <ModeButton
          buttonName={'エアギターで気持ちよくなろう！'}
        />
    </div>
  )
}
