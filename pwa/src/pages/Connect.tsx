import React from 'react'
import { Link } from 'react-router-dom'
import Scan from '../components/Scan'

const Connect = () => {
    const [url, setUrl] = React.useState('');
    const [isScanning, setIsScanning] = React.useState(false);
    const [isConnected, setIsConnected] = React.useState(false);
    

    return (
        <>
            <div>
                <h1>Connect</h1>
                <Link to="/scan">スキャン</Link>
            </div>
        </>
    )
}

export default Connect
