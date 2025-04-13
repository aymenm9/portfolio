import { useState,useRef, useEffect } from "react"

import { IoMdCloseCircle } from "react-icons/io";
import {CommandHistory, CommandInput} from "./terminalCommand.jsx"
import "../css/window.css"

export default function Terminal({terminalObjList, closeTerminal, addTerminalObj, url, openProject}){
  
  const [command, setCommand]= useState('');
  const [lastCommand, setLastCommand] = useState(null);

  const oncommandChange = (cmd) => {
    setCommand(cmd);
  }

  const terminalRef = useRef(null);

  useEffect(()=>{
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalObjList]);
  const handlPreviousCommand = (e) => {
    if (e.key === 'ArrowUp') {
        if (lastCommand){
          setCommand(terminalObjList[lastCommand].command);
        }else if (terminalObjList.length >= 1){
          setCommand(terminalObjList[terminalObjList.length -1].command)
          setLastCommand()
        }
        

    }
  }


  return (
    <div className="terminal" >
      <div className="terminal-header">
        <button onClick={closeTerminal}><IoMdCloseCircle /></button>
      </div>
      <ul className="terminal-body" ref={terminalRef} onKeyDown={handlPreviousCommand} tabIndex="0">
        
        {terminalObjList!=null && terminalObjList.map((obj,index)=><CommandHistory obj={obj} key={index}/>)}
        <CommandInput addTerminalObj={addTerminalObj} openProject={openProject} url={url} command={command} oncommandChange={oncommandChange}/>   
      </ul>
      
    </div>
  )
}

