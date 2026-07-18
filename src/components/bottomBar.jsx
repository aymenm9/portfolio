import { useState, useEffect } from "react";
import { FaWifi } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaBehanceSquare } from "react-icons/fa";
import { BsTerminalFill } from "react-icons/bs";
import { FaPowerOff } from "react-icons/fa";

import '../css/bottom_bar.css';


export default function BottomBar({ onLock, onTerminalOpen, onShutdown }) {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    const [showPowerMenu, setShowPowerMenu] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bottom-bar">
            {showPowerMenu && (
                <div className="power-menu">
                    <button onClick={onLock}>Lock</button>
                    <button onClick={onShutdown}>Shutdown</button>
                </div>
            )}
            <div className="bottom-icons">
                <button
                    className={`bottom-bar-icon ${showPowerMenu ? 'active' : ''}`}
                    onClick={() => setShowPowerMenu(!showPowerMenu)}
                >
                    <FaPowerOff />
                </button>
                <button className="bottom-bar-icon" onClick={onTerminalOpen}><BsTerminalFill /></button>
                <a href="https://github.com/aymenm9" target="_blank" className="bottom-bar-icon"><FaGithubSquare /></a>
                <a href="https://www.linkedin.com/in/aymen-merad/" target="_blank" className="bottom-bar-icon"><FaLinkedin /></a>
                <a href="https://www.behance.net/aymenmerad" target="_blank" className="bottom-bar-icon"><FaBehanceSquare /></a>

            </div>
            <div className="bottom-details">
                <span><FaWifi className="bottom-details-icon" /></span>
                <span>{currentTime}</span>
            </div>

        </div>
    )
}