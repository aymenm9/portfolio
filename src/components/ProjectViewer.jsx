import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaArrowRight, FaXmark } from 'react-icons/fa6';

/* ------------------------------------------------------------------ */
/*  Dossier project viewer — used ONLY by the standard portfolio.      */
/*  The desktop OS keeps its own viewer (project.jsx / projectViews).  */
/*                                                                     */
/*  Render priority:                                                   */
/*    1. HTML presentation (project.presentation → public/ URL)        */
/*    2. first markdown resource                                       */
/*    3. first image resource                                          */
/*    4. plain description                                             */
/* ------------------------------------------------------------------ */

export default function ProjectViewer({ project, onClose }) {
    const mdRes = useMemo(
        () => project?.content?.find((r) => r.type === 'markdown') || null,
        [project]
    );
    const imgRes = useMemo(
        () => project?.content?.find((r) => r.type === 'image') || null,
        [project]
    );
    const mode = project?.presentation ? 'html' : mdRes ? 'md' : imgRes ? 'img' : 'text';

    const [md, setMd] = useState('');

    useEffect(() => {
        if (mode !== 'md' || !mdRes) return undefined;
        const ctrl = new AbortController();
        setMd('');
        fetch(mdRes.path, { signal: ctrl.signal })
            .then((r) => r.text())
            .then(setMd)
            .catch(() => { /* aborted or missing — viewer stays on the description */ });
        return () => ctrl.abort();
    }, [mode, mdRes]);

    // Esc closes + lock page scroll while open
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!project) return null;

    const fileLabel = mode === 'html'
        ? `${project.name}/index.html — [presentation]`
        : mode === 'md'
            ? `${mdRes.name} — [rendered]`
            : mode === 'img'
                ? `${imgRes.name} — [preview]`
                : 'readme — [missing]';

    return (
        <div className="pv-overlay" onClick={onClose}>
            <div
                className="pv-panel"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${project.name} — project viewer`}
            >
                <header className="pv-head">
                    <span className="pv-file">{fileLabel}</span>
                    <h3 className="pv-title">{project.name.replace(/_/g, ' ')}</h3>
                    <div className="pv-meta">
                        {(project.tags || []).map((t) => <span key={t} className="pv-tag">{t}</span>)}
                        {project.link && (
                            <a className="pv-src" href={project.link} target="_blank" rel="noopener noreferrer">
                                source <FaArrowRight />
                            </a>
                        )}
                        <button type="button" className="pv-close" onClick={onClose} aria-label="close viewer">
                            <FaXmark />
                        </button>
                    </div>
                </header>

                <div className="pv-body">
                    {mode === 'html' && (
                        <iframe
                            className="pv-frame"
                            src={project.presentation}
                            title={`${project.name} — presentation`}
                        />
                    )}
                    {mode === 'md' && (
                        <div className="pv-md">
                            <ReactMarkdown>{md || project.description || ''}</ReactMarkdown>
                        </div>
                    )}
                    {mode === 'img' && (
                        <img className="pv-img" src={imgRes.path} alt={project.name} />
                    )}
                    {mode === 'text' && (
                        <p className="pv-desc">{project.description}</p>
                    )}
                </div>

                <footer className="pv-foot">
                    <span>dossier viewer — html · md · img</span>
                    <span>esc / click outside to close</span>
                </footer>
            </div>
        </div>
    );
}
