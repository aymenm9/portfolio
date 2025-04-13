import { useState } from 'react';
import LockScreen from './lockScreen.jsx';
import HomeScreen from './homeScreen.jsx';

import '../css/screen.css';


export default function Screen(){
    const [lock, setLock] = useState(true);
    const handleUnlock = () => setLock(false);
    const handlelock = () => setLock(true);


    return (
        <div className="screen" style={{ backgroundBlendMode: lock ? 'overlay' : 'normal' }}>
            {lock ? <LockScreen onUnlock={handleUnlock} /> : <HomeScreen onLock={handlelock}/>}
        </div>
    )

}