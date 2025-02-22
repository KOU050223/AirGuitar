import Scan from '../components/Scan'
import { Link } from 'react-router-dom'

const Connect = () => {
    return (
        <>
            <div>
                <h1 className='text-center'>接続ページ</h1>
                <Scan />
                {/* テスト用 */}
                <Link to='/sound_setting_mode' className='text-center'>サウンドセッティングモード</Link>
            </div>
        </>
    )
}

export default Connect
