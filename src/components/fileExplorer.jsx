import { useState } from 'react';
import Draggable from 'react-draggable';
import { FaArrowLeft, FaArrowUp, FaFolder, FaFile, FaFolderOpen } from 'react-icons/fa6';
import { listEntries, resolvePath } from './utils';
import { IoMdCloseCircle } from 'react-icons/io';
import '../css/file_explorer.css';

function kindOf(item) {
    if (!item.type || item.type === 'resource') return 'folder';
    return item.type;
}

export default function FileExplorer({ initialPath = ['Desktop'], onClose, openProject }) {
    const [path, setPath] = useState(initialPath);
    const node = resolvePath(path);
    const entries = listEntries(node).sort((a, b) => {
        if (kindOf(a) === 'folder' && kindOf(b) !== 'folder') return -1;
        if (kindOf(a) !== 'folder' && kindOf(b) === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });

    const openEntry = (entry) => {
        const nextPath = [...path, entry.name];
        if (entry.type === 'resource') {
            openProject(entry);
        } else if (!entry.type) {
            setPath(nextPath);
        } else {
            openProject(entry);
        }
    };

    const goUp = () => {
        if (path.length > 1) setPath(path.slice(0, -1));
    };

    return (
        <Draggable handle=".explorer-header" bounds="parent">
            <section className="file-explorer window" aria-label="File explorer">
                <header className="explorer-header window-header">
                    <span><FaFolderOpen /> Files</span>
                    <button onClick={onClose} aria-label="Close file explorer"><IoMdCloseCircle /></button>
                </header>
                <div className="explorer-toolbar">
                    <button onClick={() => path.length > 1 && setPath(path.slice(0, -1))} disabled={path.length <= 1} aria-label="Go back"><FaArrowLeft /></button>
                    <button onClick={goUp} disabled={path.length <= 1} aria-label="Go up"><FaArrowUp /></button>
                    <div className="explorer-breadcrumbs">
                        {path.map((part, index) => (
                            <button key={`${part}-${index}`} onClick={() => setPath(path.slice(0, index + 1))}>{part}</button>
                        ))}
                    </div>
                </div>
                <div className="explorer-body">
                    {entries.length ? entries.map((entry) => (
                        <button className="explorer-entry" key={entry.name} onDoubleClick={() => openEntry(entry)} title="Double-click to open">
                            <span className="explorer-entry-icon">{kindOf(entry) === 'folder' ? <FaFolder /> : <FaFile />}</span>
                            <span className="explorer-entry-name">{entry.name.replace(/_/g, ' ')}</span>
                            <span className="explorer-entry-type">{kindOf(entry)}</span>
                        </button>
                    )) : <p className="explorer-empty">This folder is empty.</p>}
                </div>
                <footer className="explorer-status">{entries.length} item{entries.length === 1 ? '' : 's'} · double-click to open</footer>
            </section>
        </Draggable>
    );
}
