import { useState } from 'react'
import Terminal from './terminal.jsx'
import Project from './project.jsx'
import FileExplorer from './fileExplorer.jsx'
import ButtomBar from './bottomBar.jsx'
import { fileSystem } from '../fileSystem.js'
import { FaFolder, FaFileLines } from 'react-icons/fa6'
import '../css/home_screen.css';
import '../css/file_explorer.css';

function DesktopIcon({ name, node, onOpen }) {
  const [selected, setSelected] = useState(false);
  const isFolder = !node.type || node.type === 'resource';
  return (
    <button className={`desktop-icon ${selected ? 'selected' : ''}`} onClick={() => setSelected(true)} onDoubleClick={() => onOpen(node, name)} title="Double-click to open">
      <span className="desktop-icon-art">{isFolder ? <FaFolder /> : <FaFileLines />}</span>
      <span>{name.replace(/_/g, ' ')}</span>
    </button>
  );
}

export default function HomeScreen({ onLock, onShutdown }) {

  const [terminal, setTerminal] = useState({ objs: null, url: null });
  const [project, setProject] = useState(null);
  const [explorerPath, setExplorerPath] = useState(null);
  const [theme, setTheme] = useState('light');

  const openTerminal = () => {
    setTerminal(
      {
        objs: null,
        url: ['Desktop'],
      }
    );
  }
  const addTerminalObj = (newTerminalObj, new_url) => {
    setTerminal({
      objs: terminal.objs != null ? [...terminal.objs, newTerminalObj] : [newTerminalObj],
      url: new_url,
    })
  };
  const closeTerminal = () => {
    setTerminal({ objs: null, url: null });
  }

  const clearTerminal = () => setTerminal((current) => ({ ...current, objs: null }));

  /*useEffect(() => {
    let strPath = '';
    if(terminal.url){let path = terminal.url.map((dir) => `${ dir }/`);
strPath = 'terminal/' + path.join('')
    }
window.history.pushState({}, '', `/home-screen/${terminal.url ? strPath : ''}`);
  }, [terminal.url]);*/


  const openProject = (projectobj) => {
    setProject(projectobj);
  }
  const closeProject = () => {
    setProject(null);
  }

  const openDesktopItem = (node, name) => {
    if (!node.type) {
      setExplorerPath(['Desktop', name]);
    } else {
      openProject(node);
    }
  };

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');


  return (
    <div className="home-screen" data-os-theme={theme}>
      <div className="desktop-icons" aria-label="Desktop files">
        {Object.entries(fileSystem.Desktop).map(([name, node]) => (
          <DesktopIcon key={name} name={name} node={node} onOpen={openDesktopItem} />
        ))}
      </div>
      {terminal.url && <Terminal terminalObjList={terminal.objs} closeTerminal={closeTerminal} clearTerminal={clearTerminal} addTerminalObj={addTerminalObj} url={terminal.url} openProject={openProject} />}
      {project && <Project projectObj={project} closeProject={closeProject} />}
      {explorerPath && <FileExplorer initialPath={explorerPath} onClose={() => setExplorerPath(null)} openProject={openProject} />}
      <ButtomBar onLock={onLock} onShutdown={onShutdown} onTerminalOpen={openTerminal} onExplorerOpen={() => setExplorerPath(['Desktop'])} onThemeToggle={toggleTheme} theme={theme} />
    </div>

  )
}
