import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaLinkedin, FaBehance } from 'react-icons/fa6';
import { projects } from '../data/projects';
import { fileSystem } from '../fileSystem';
import ProjectViewer from './ProjectViewer';
import meImg from '../assets/images/me.jpg';
import '../css/standardPortfolio.css';

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */

const EMAIL = 'aymen_merad@proton.me';
const LOCATION = 'Sétif, DZ';
const COORDS = '36.19°N — 5.41°E';
const YEAR = new Date().getFullYear();

const ROLES = ['Backend Developer', 'AI Integration Engineer', 'Automation Builder'];

const SOCIALS = [
    { icon: <FaGithub />, href: 'https://github.com/aymenm9', label: 'GitHub', handle: '@aymenm9' },
    { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/aymen-merad/', label: 'LinkedIn', handle: '/aymen-merad' },
    { icon: <FaBehance />, href: 'https://www.behance.net/aymenmerad', label: 'Behance', handle: '/aymenmerad' },
];

const NAV_LINKS = [
    { label: 'About', href: '#about', idx: '01' },
    { label: 'Stack', href: '#stack', idx: '02' },
    { label: 'Works', href: '#works', idx: '03' },
    { label: 'Contact', href: '#contact', idx: '06' },
];

const TECH_GROUPS = [
    {
        title: 'Core',
        items: ['Python', 'FastAPI / Flask', 'PostgreSQL / MySQL', 'Redis', 'Docker', 'REST APIs', 'Background tasks'],
    },
    {
        title: 'AI Integration',
        items: ['Gemini Integration', 'AI Agents', 'Retrieval / Q&A systems', 'Chatbots — web & Telegram', 'Automation pipelines'],
    },
    {
        title: 'Frontend / Support',
        items: ['React', 'Advanced JS / interactions', 'Design + Branding', 'Deployment — Linux, cloud'],
    },
];

const EDUCATION = [
    {
        date: 'Sep 2024 — Jul 2026',
        tag: 'M.Sc',
        title: 'Data Engineering & Web Technology',
        place: 'Ferhat Abbas University · Sétif, DZ',
        desc: 'Advanced AI · Advanced Databases · Advanced Web · Advanced Algorithms · Cloud Computing · Web Security · Machine Learning.',
    },
    {
        date: 'Sep 2021 — Jul 2024',
        tag: 'B.Sc',
        title: 'Computer Science — Information Systems',
        place: 'Ferhat Abbas University · Sétif, DZ',
        desc: 'Algorithms & Data Structures · Operating Systems · Software Engineering · Web · Databases · AI · Security · HCI.',
    },
];

const EXPERIENCE = [
    {
        date: 'Dec 2024 — Jul 2025',
        tag: 'Teacher',
        title: 'Application Development Teacher',
        place: 'I.E.P Sétif',
        points: [
            'Taught Python fundamentals through hands-on exercises',
            'Networking concepts, SQLite / SQL Server configuration',
            'Java fundamentals and OOP concepts',
            'Managed lab materials & tooling',
        ],
    },
    {
        date: '2021 — Jan 2023',
        tag: 'Freelance',
        title: 'Graphic Designer',
        place: 'Fiverr & direct clients',
        points: [
            'Maintained a 5-star rating on Fiverr',
            'Designed brand identities & logos for marketing agencies',
            'Social media content & varied client design work',
        ],
    },
];

const thumbOf = (p) => {
    const node = fileSystem.Desktop.Projects[p.id];
    return node?.thumbnailPath || node?.content?.find((r) => r.type === 'image')?.path || null;
};

const glyphs = (word) =>
    word.split('').map((ch, i) => (
        <span className="glyph" key={i}>{ch}</span>
    ));

/* ------------------------------------------------------------------ */
/* Hooks                                                                */
/* ------------------------------------------------------------------ */

// Text scramble — resolves toward `target` each time `trigger` changes.
function useScramble(target, trigger = 0) {
    const CHARS = '!*+~}{][|_-=:?#%$';
    const [out, setOut] = useState(target);
    const frame = useRef(0);
    const queue = useRef([]);
    const raf = useRef(0);
    const plain = useRef(target); // last resolved plain text (never the HTML soup)

    useEffect(() => {
        const oldText = plain.current;
        plain.current = target;
        const length = Math.max(oldText.length, target.length);
        queue.current = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = target[i] || '';
            const start = Math.floor(Math.random() * 12);
            const end = start + Math.floor(Math.random() * 12) + 4;
            queue.current.push({ from, to, start, end, char: '' });
        }
        frame.current = 0;

        const loop = () => {
            let complete = 0;
            let next = '';
            for (let i = 0; i < queue.current.length; i++) {
                const q = queue.current[i];
                if (frame.current >= q.end) { complete++; next += q.to; continue; }
                if (frame.current >= q.start) {
                    if (!q.char || Math.random() < 0.28) {
                        q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                    next += `<span class="scr-dim">${q.char}</span>`;
                } else {
                    next += q.from;
                }
            }
            setOut(next);
            if (complete === queue.current.length) {
                setOut(target);
                return;
            }
            frame.current++;
            raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf.current);
    }, [target, trigger]);

    return out;
}

// Live clock — Africa/Algiers
function useClock() {
    const [now, setNow] = useState('--:--:--');
    useEffect(() => {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Algiers',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
        const tick = () => setNow(fmt.format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return now;
}

// Cycling role with scramble transition
function useRole() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setIdx((i) => (i + 1) % ROLES.length), 3400);
        return () => clearInterval(id);
    }, []);
    return useScramble(ROLES[idx], idx);
}

/* ------------------------------------------------------------------ */
/* Micro components                                                     */
/* ------------------------------------------------------------------ */

// Scroll reveal — masked rise, once
function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVis(true);
                io.disconnect();
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} rv ${vis ? 'on' : ''}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

// Boot overlay — fast terminal counter, then lifts
function Boot({ lift, onLifted, onDone }) {
    const [n, setN] = useState(0);

    useEffect(() => {
        let raf;
        const t0 = performance.now();
        const DURATION = 900;
        const tick = (t) => {
            const p = Math.min(1, Math.max(0, (t - t0) / DURATION));
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * 100));
            if (p < 1) raf = requestAnimationFrame(tick);
            else setTimeout(onDone, 200);
        };
        raf = requestAnimationFrame(tick);
        const safety = setTimeout(onDone, 1800); // rAF may be throttled in background tabs
        return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
    }, [onDone]);

    return (
        <div
            className={`boot ${lift ? 'lift' : ''}`}
            onTransitionEnd={(e) => { if (e.propertyName === 'transform' && lift) onLifted(); }}
            aria-hidden
        >
            <div className="boot-log">
                <span>&gt; merad.folio — v2.0</span>
                <span>&gt; loading modules …… ok</span>
                <span>&gt; mounting interface</span>
            </div>
            <div className="boot-count">{String(n).padStart(3, '0')}</div>
            <div className="boot-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></div>
        </div>
    );
}

// Custom cursor — dot + lagged ring, label state on work rows
function Cursor() {
    const dot = useRef(null);
    const ring = useRef(null);
    const label = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
            if (dot.current) {
                dot.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
            }
        };

        let raf;
        const loop = () => {
            ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.16;
            ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.16;
            if (ring.current) {
                const r = ring.current.offsetWidth / 2;
                ring.current.style.transform = `translate(${ringPos.current.x - r}px, ${ringPos.current.y - r}px)`;
            }
            raf = requestAnimationFrame(loop);
        };
        loop();

        const onOver = (e) => {
            const lbl = e.target.closest('[data-cursor-label]');
            const act = e.target.closest('a, button, [data-cursor]');
            ring.current?.classList.toggle('is-label', !!lbl);
            dot.current?.classList.toggle('is-label', !!lbl);
            if (label.current) label.current.textContent = lbl ? lbl.getAttribute('data-cursor-label') : '';
            ring.current?.classList.toggle('is-active', !!act && !lbl);
            dot.current?.classList.toggle('is-active', !!act && !lbl);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onOver);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
        };
    }, []);

    return (
        <>
            <div ref={dot} className="cur-dot" aria-hidden />
            <div ref={ring} className="cur-ring" aria-hidden>
                <span ref={label} className="cur-label" />
            </div>
        </>
    );
}

function SectionHead({ no, title, note }) {
    return (
        <Reveal className="s-head">
            <span className="s-no">§{no}</span>
            <h2 className="s-title">{title}</h2>
            <span className="s-note">+ {note}</span>
            <span className="s-rule" />
        </Reveal>
    );
}

function Marquee() {
    const items = [...ROLES, 'Open to work', 'Sétif → Remote', 'Backend / AI / Automation'];
    return (
        <div className="marquee" aria-hidden>
            <div className="marquee-track">
                {[...items, ...items].map((it, i) => (
                    <span className="marquee-item" key={i}>{it}</span>
                ))}
            </div>
        </div>
    );
}

// Cursor-warped background — a field of crosses pushed aside by a "central mass"
function DistortField({ theme }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const dpr = Math.min(1.5, window.devicePixelRatio || 1);
        const GAP = 48;
        const RADIUS = 190;
        const PUSH = 34;
        let pts = [];
        let raf = 0;
        const mouse = { x: -9999, y: -9999 };

        const cs = getComputedStyle(canvas);
        const base = cs.getPropertyValue('--dg-base').trim() || 'rgba(255,255,255,0.14)';
        const hot = cs.getPropertyValue('--dg-hot').trim() || '#ccff00';

        const build = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            pts = [];
            for (let y = GAP / 2; y < h; y += GAP) {
                for (let x = GAP / 2; x < w; x += GAP) pts.push({ ox: x, oy: y, x, y });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (const p of pts) {
                const dx = p.ox - mouse.x;
                const dy = p.oy - mouse.y;
                const d = Math.hypot(dx, dy);
                let tx = p.ox; let ty = p.oy;
                if (d < RADIUS && d > 0.01) {
                    const f = (1 - d / RADIUS) ** 2 * PUSH;
                    tx = p.ox + (dx / d) * f;
                    ty = p.oy + (dy / d) * f;
                }
                p.x += (tx - p.x) * 0.14;
                p.y += (ty - p.y) * 0.14;
                const disp = Math.hypot(p.x - p.ox, p.y - p.oy);
                ctx.strokeStyle = disp > 3 ? hot : base;
                ctx.globalAlpha = disp > 3 ? Math.min(0.85, 0.25 + disp / 22) : 1;
                ctx.beginPath();
                ctx.moveTo(p.x - 3.5, p.y); ctx.lineTo(p.x + 3.5, p.y);
                ctx.moveTo(p.x, p.y - 3.5); ctx.lineTo(p.x, p.y + 3.5);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };

        const loop = () => { draw(); raf = requestAnimationFrame(loop); };
        const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const onOut = () => { mouse.x = -9999; mouse.y = -9999; };

        build();
        if (reduced) {
            draw();
        } else {
            loop();
            window.addEventListener('mousemove', onMove);
            document.documentElement.addEventListener('mouseleave', onOut);
        }
        window.addEventListener('resize', build);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', build);
            document.documentElement.removeEventListener('mouseleave', onOut);
        };
    }, [theme]);

    return <canvas ref={ref} className="distort" aria-hidden="true" />;
}

// Works rail — the section pins to the viewport and vertical scroll drives
// the cards sideways; when the last card passes, the page flows down again.
function WorksRail({ onOpen }) {
    const wrapRef = useRef(null);
    const trackRef = useRef(null);
    const barRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const track = trackRef.current;
        let maxShift = 0;
        let raf = 0;

        const measure = () => {
            maxShift = Math.max(0, track.scrollWidth - wrap.clientWidth);
            // one pixel of vertical scroll == one pixel of sideways travel
            wrap.style.height = `${window.innerHeight + maxShift}px`;
        };

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rect = wrap.getBoundingClientRect();
                const range = rect.height - window.innerHeight;
                const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
                track.style.transform = `translate3d(${-p * maxShift}px, 0, 0)`;
                if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
            });
        };

        measure();
        onScroll();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className="rail-pin" ref={wrapRef}>
            <div className="rail-sticky">
                <div className="rail-head">
                    <span className="s-no">§03</span>
                    <h2 className="s-title">Works</h2>
                    <span className="s-note">+ the page moves sideways here</span>
                    <span className="rail-progress" aria-hidden><i ref={barRef} /></span>
                </div>
                <div className="rail-track" ref={trackRef}>
                    {projects.map((p, i) => {
                        const src = thumbOf(p);
                        return (
                            <article
                                key={p.id}
                                className="stack-card rail-card"
                                onClick={() => onOpen(p.id)}
                                data-cursor-label="open ↗"
                            >
                                <div className="st-media">
                                    {src
                                        ? <img src={src} alt="" loading="lazy" draggable="false" />
                                        : <span className="st-blank">{p.name[0]}</span>}
                                    <span className="st-idx">
                                        {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="st-meta">
                                    <span className="st-cat">{p.tags.join(' — ')}</span>
                                    <h3 className="st-title">{p.name.replace(/_/g, ' ')}</h3>
                                    <p className="st-desc">{p.description}</p>
                                    <div className="st-foot">
                                        <a
                                            href={p.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            data-cursor
                                        >
                                            src ↗
                                        </a>
                                        <span className="st-open">inspect ↗</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                    <span className="rail-end" aria-hidden>/fin</span>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const StandardPortfolio = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('boot'); // boot → lift → gone
    const [theme, setTheme] = useState(() => localStorage.getItem('am-theme') || 'dark');
    const [openNode, setOpenNode] = useState(null);
    const [leaving, setLeaving] = useState(false);
    const [scrambleKey, setScrambleKey] = useState(0);

    const clock = useClock();
    const roleHtml = useRole();
    const emailHtml = useScramble(EMAIL, scrambleKey);
    const progressRef = useRef(null);

    useEffect(() => { localStorage.setItem('am-theme', theme); }, [theme]);

    // Safety: never let the boot overlay get stuck if transitionend doesn't fire
    useEffect(() => {
        if (phase !== 'lift') return;
        const id = setTimeout(() => setPhase('gone'), 1300);
        return () => clearTimeout(id);
    }, [phase]);

    // Scroll progress hairline
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const h = document.documentElement;
                const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
                if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    }, []);

    const goDesktop = () => {
        if (leaving) return;
        setLeaving(true);
        setTimeout(() => navigate('/lock'), 640);
    };

    return (
        <div className={`std-portfolio ${phase !== 'boot' ? 'is-booted' : ''}`} data-theme={theme} id="top">
            <Cursor />
            <span className="progress" ref={progressRef} aria-hidden />

            {/* Structural column guides */}
            <div className="guides" aria-hidden><i /><i /><i /></div>

            {/* Cursor-warped background field */}
            <DistortField theme={theme} />

            {phase !== 'gone' && (
                <Boot
                    lift={phase === 'lift'}
                    onDone={() => setPhase('lift')}
                    onLifted={() => setPhase('gone')}
                />
            )}

            {/* Wipe transition into the desktop OS */}
            <div className={`wipe ${leaving ? 'on' : ''}`} aria-hidden>
                <span>&gt; BOOTING DESKTOP.EXE _</span>
            </div>

            <div className="wrap">

                {/* ---------------- Header ---------------- */}
                <header className="hdr">
                    <a href="#top" className="wordmark stage" style={{ '--d': '80ms' }} data-cursor>
                        A.MERAD<sup>©</sup>
                        <span className="wm-sub">folio — vol.02</span>
                    </a>

                    <nav className="nav stage" style={{ '--d': '160ms' }}>
                        {NAV_LINKS.map((l) => (
                            <a key={l.label} href={l.href} className="nav-link" data-idx={l.idx}>
                                {l.label}
                                <span className="nl-bar" />
                            </a>
                        ))}
                    </nav>

                    <div className="hdr-right stage" style={{ '--d': '240ms' }}>
                        <span className="hdr-clock">{LOCATION.split(',')[0]} — {clock}</span>
                        <button
                            className="theme-toggle"
                            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                            data-cursor
                            aria-label="Toggle theme"
                        >
                            <span className={theme === 'dark' ? 'on' : ''}>DARK</span>
                            <i />
                            <span className={theme === 'light' ? 'on' : ''}>LIGHT</span>
                        </button>
                        <button className="run-btn" onClick={goDesktop} data-cursor>
                            <b>&gt;_</b> desktop.exe
                        </button>
                    </div>
                </header>

                {/* ---------------- Hero ---------------- */}
                <section className="hero">
                    <div className="hero-rail stage" style={{ '--d': '340ms' }}>
                        <div className="hr-row">
                            <span><b>FOLIO/{YEAR}</b> — selected works &amp; systems</span>
                            <span className="hr-status"><i />open for work</span>
                        </div>
                        <div className="hr-row">
                            <span>loc — {LOCATION}</span>
                            <span>{COORDS} · gmt+1</span>
                        </div>
                    </div>

                    <h1 className="hero-name">
                        <span className="mask"><span className="hn-line" style={{ '--d': '420ms' }}>{glyphs('AYMEN')}</span></span>
                        <span className="mask"><span className="hn-line outline" style={{ '--d': '520ms' }}>{glyphs('MERAD')}<span className="hn-dot">.</span></span></span>
                    </h1>

                    <div className="hero-band">
                        <div className="hero-left">
                            <p className="hero-serif mask"><span style={{ '--d': '640ms' }}>
                                I make <em>backends behave</em> &amp; <em>frontends feel</em>.
                            </span></p>
                            <p className="hero-role stage" style={{ '--d': '700ms' }}>
                                <span className="hr-label">role&gt;</span>
                                <span dangerouslySetInnerHTML={{ __html: roleHtml }} />
                                <span className="caret" />
                            </p>
                            <p className="hero-sub stage" style={{ '--d': '780ms' }}>
                                Robust backend systems, automation workflows and AI-powered agents
                                that solve real problems — strong Python, thoughtful frontend,
                                and a designer&apos;s eye for the edges.
                            </p>
                            <div className="hero-cta stage" style={{ '--d': '860ms' }}>
                                <a href="#works" className="btn btn-solid" data-cursor>
                                    selected works <FaArrowRight />
                                </a>
                                <a href={`mailto:${EMAIL}`} className="btn btn-line" data-cursor>contact</a>
                            </div>
                        </div>

                        <figure className="hero-portrait stage" style={{ '--d': '600ms' }} data-cursor>
                            <span className="crop tl" /><span className="crop tr" />
                            <span className="crop bl" /><span className="crop br" />
                            <img src={meImg} alt="Aymen Merad" />
                            <figcaption><b>fig.01</b> — the author, {LOCATION}</figcaption>
                        </figure>
                    </div>

                    <span className="hero-vert" aria-hidden>backend — ai — automation — {YEAR}</span>

                    <div className="hero-scroll stage" style={{ '--d': '1000ms' }}>
                        <span>scroll</span>
                        <span className="hs-line" />
                        <span>↓</span>
                    </div>
                </section>
            </div>

            <Marquee />

            <div className="wrap">

                {/* ---------------- About ---------------- */}
                <section id="about" className="sect">
                    <SectionHead no="01" title="About" note="who / how" />
                    <div className="about">
                        <Reveal className="about-main">
                            <p>
                                I build <em>backend systems</em> and <em>AI-powered features</em> that
                                solve real problems — clean architecture, honest performance, and
                                turning messy workflows into <em>automated pipelines</em>.
                            </p>
                        </Reveal>
                        <div className="about-meta">
                            {[
                                ['Based', LOCATION],
                                ['Focus', 'Backend · AI · Automation'],
                                ['Stack', 'Python · FastAPI · LLMs'],
                                ['Status', 'Open to work'],
                            ].map(([k, v], i) => (
                                <Reveal className="am-row" key={k} delay={i * 70}>
                                    <span className="am-k">{k}</span>
                                    <span className="am-v">{v}</span>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ---------------- Stack ---------------- */}
                <section id="stack" className="sect">
                    <SectionHead no="02" title="Stack" note="tools / surface" />
                    <div className="stack">
                        {TECH_GROUPS.map((g, gi) => (
                            <Reveal className="stack-row" key={g.title} delay={gi * 80}>
                                <span className="st-lbl">/{g.title}</span>
                                <div className="st-items">
                                    {g.items.map((it, i) => (
                                        <span className="st-item" key={it} style={{ '--i': i }}>{it}</span>
                                    ))}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- Works (pinned horizontal rail) ---------------- */}
                <section id="works" className="rail-sect">
                    <WorksRail onOpen={(id) => setOpenNode(fileSystem.Desktop.Projects[id])} />
                </section>

                {/* ---------------- Education ---------------- */}
                <section id="education" className="sect">
                    <SectionHead no="04" title="Education" note="academic record" />
                    <div className="ledger">
                        {EDUCATION.map((item, i) => (
                            <Reveal className="ld-row" key={item.title} delay={i * 90}>
                                <span className="ld-date">{item.date}</span>
                                <div className="ld-main">
                                    <h3>{item.title}</h3>
                                    <span className="ld-place">{item.place}</span>
                                    <p className="ld-desc">{item.desc}</p>
                                </div>
                                <span className="ld-tag">{item.tag}</span>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- Experience ---------------- */}
                <section id="experience" className="sect">
                    <SectionHead no="05" title="Experience" note="recent history" />
                    <div className="ledger">
                        {EXPERIENCE.map((item, i) => (
                            <Reveal className="ld-row" key={item.title} delay={i * 90}>
                                <span className="ld-date">{item.date}</span>
                                <div className="ld-main">
                                    <h3>{item.title}</h3>
                                    <span className="ld-place">{item.place}</span>
                                    <ul className="ld-list">
                                        {item.points.map((pt) => <li key={pt}>{pt}</li>)}
                                    </ul>
                                </div>
                                <span className="ld-tag">{item.tag}</span>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- Contact ---------------- */}
                <section id="contact" className="sect contact">
                    <SectionHead no="06" title="Contact" note="end of file" />
                    <Reveal>
                        <p className="contact-serif">Don&apos;t be a stranger — <em>say hello.</em></p>
                    </Reveal>
                    <Reveal delay={90}>
                        <a
                            href={`mailto:${EMAIL}`}
                            className="contact-email"
                            data-cursor
                            onMouseEnter={() => setScrambleKey((k) => k + 1)}
                            dangerouslySetInnerHTML={{ __html: emailHtml }}
                        />
                    </Reveal>
                    <Reveal delay={160}>
                        <div className="socials">
                            {SOCIALS.map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="soc-row" data-cursor>
                                    <span className="soc-ic">{s.icon}</span>
                                    <span className="soc-label">{s.label}</span>
                                    <span className="soc-handle">{s.handle}</span>
                                    <span className="soc-arrow">↗</span>
                                </a>
                            ))}
                        </div>
                    </Reveal>
                    <Reveal delay={220}>
                        <button className="contact-os" onClick={goDesktop} data-cursor>
                            prefer pixels? — <b>boot the desktop os</b> <FaArrowRight />
                        </button>
                    </Reveal>
                </section>

                <footer className="ftr">
                    <span>© {YEAR} aymen merad</span>
                    <span className="ftr-mid">designed &amp; built by hand — {LOCATION}</span>
                    <a href="#top" className="ftr-top" data-cursor>↑ top</a>
                    <span className="ftr-end">/eof</span>
                </footer>
            </div>

            {/* Project viewer (dossier edition — html/md, separate from the OS viewer) */}
            {openNode && (
                <ProjectViewer project={openNode} onClose={() => setOpenNode(null)} />
            )}
        </div>
    );
};

export default StandardPortfolio;
