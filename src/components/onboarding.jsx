import { useState } from 'react';
import { FaFolder, FaFolderOpen, FaSun, FaMoon } from 'react-icons/fa6';
import { BsTerminalFill } from 'react-icons/bs';
import { TbMessageChatbot } from 'react-icons/tb';
import '../css/onboarding.css';

const KEY = 'am_desktop_onboarded';

export default function Onboarding({ theme, onDismiss }) {
    const [closing, setClosing] = useState(false);

    const dismiss = () => {
        setClosing(true);
        try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
        setTimeout(onDismiss, 220);
    };

    const steps = [
        { icon: <FaFolder />, title: 'Desktop icons', body: 'Double-click any icon to open a folder or file. Single-click selects it.' },
        { icon: <BsTerminalFill />, title: 'Terminal', body: 'Open it from the taskbar. Type help for commands — ls, cd, cat, open, pwd, clear.' },
        { icon: <FaFolderOpen />, title: 'Files app', body: 'The folder button in the taskbar opens a graphical file explorer with breadcrumbs.' },
        { icon: theme === 'light' ? <FaMoon /> : <FaSun />, title: 'Theme', body: 'Toggle dark / light with the sun–moon button in the taskbar.' },
        { icon: <TbMessageChatbot />, title: 'Aymen-Bot', body: 'Bottom-right button opens a chatbot that answers questions about me.' },
    ];

    return (
        <div className={`onboard-overlay ${closing ? 'closing' : ''}`} role="dialog" aria-modal="true" aria-label="Welcome">
            <section className={`onboard-modal ${closing ? 'closing' : ''}`}>
                <header className="onboard-head">
                    <span className="onboard-kicker">/home — desktop os</span>
                    <h2>Welcome — read this first</h2>
                </header>
                <p className="onboard-intro">
                    This portfolio is also a tiny desktop environment. Here&apos;s how to move around it.
                </p>
                <ol className="onboard-steps">
                    {steps.map((s, i) => (
                        <li key={s.title} style={{ '--i': i }}>
                            <span className="onboard-ic">{s.icon}</span>
                            <span className="onboard-t">{s.title}</span>
                            <span className="onboard-b">{s.body}</span>
                        </li>
                    ))}
                </ol>
                <footer className="onboard-foot">
                    <button className="onboard-go" onClick={dismiss} autoFocus>Got it — start exploring</button>
                </footer>
            </section>
        </div>
    );
}