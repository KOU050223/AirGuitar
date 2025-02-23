import React from 'react'
import { Link } from 'react-router-dom'

const ModeButton = ({buttonName,mode ,onClick=()=>{} }) => {
    const data = {
        mode: mode
    };

return (
    <Link to='/playpage' state={data} className='bg-white shadow-md rounded-lg overflow-hidden' onClick={onClick}>
        <div className='bg-blue-500 text-white p-4'>
            {buttonName}
        </div>
    </Link>
)
}

export default ModeButton
