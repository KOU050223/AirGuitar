import React from 'react'

const ModeButton = ({buttonName}) => {
    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('メッセージ送信中...');
            ws.send('Hello from PC management UI');
            console.log('メッセージ送信完了');
        } else {
            console.log('WebSocketが接続されていません');
        }
    }
return (
    <button className='bg-white shadow-md rounded-lg overflow-hidden' onClick={sendMessage}>
        <div className='bg-blue-500 text-white p-4'>
            {buttonName}
        </div>
    </button>
)
}

export default ModeButton
