import { useState, useRef, useEffect } from "react"
import Draggable from 'react-draggable';
import { IoMdCloseCircle } from "react-icons/io";
import { CommandHistory, CommandInput } from "./terminalCommand.jsx"
import "../css/window.css"

export default function Terminal({ terminalObjList, closeTerminal, clearTerminal, addTerminalObj, url, openProject }) {

  const [command, setCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const dragRef = useRef(null);

  const oncommandChange = (cmd) => {
    setCommand(cmd);
  }

  const terminalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 10);
  }, [terminalObjList]);
  const handleHistory = (e) => {
    if (!terminalObjList?.length) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex < 0 ? terminalObjList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(terminalObjList[nextIndex].command);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= terminalObjList.length) {
        setHistoryIndex(-1);
        setCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setCommand(terminalObjList[nextIndex].command);
      }
    }
  }


  return (
    <Draggable handle=".terminal-header" nodeRef={dragRef}>
      <div className="terminal" ref={dragRef}>
        <div className="terminal-header" style={{ cursor: 'move' }}>
          <button onClick={closeTerminal}><IoMdCloseCircle /></button>
        </div>
          <ul className="terminal-body" ref={terminalRef} onKeyDown={handleHistory} tabIndex="0">

          {terminalObjList != null && terminalObjList.map((obj, index) => <CommandHistory obj={obj} key={index} />)}
          <CommandInput addTerminalObj={addTerminalObj} clearTerminal={clearTerminal} openProject={openProject} url={url} command={command} oncommandChange={oncommandChange} />
        </ul>

      </div>
    </Draggable>
  )
}
