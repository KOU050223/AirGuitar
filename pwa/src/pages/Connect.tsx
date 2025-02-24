import Scan from '../components/Scan'
import { Link } from 'react-router-dom'

const Connect = () => {
    return (
        <>
            <div>
                <h1 className='text-center'>接続ページ</h1>
                <Scan />
                {/* テスト用 */}
                <p><Link to='/sound_setting_mode' className='text-center'>サウンドセッティングモード</Link></p>
                <p><Link to='/pawer_code_mode'>パワーコード</Link></p>
                <p><Link to='/easy_mode'>イージー</Link></p>
            </div>
        </>
    )
}

export default Connect
