import { useState, useEffect } from 'react'
import Terminal from './terminal.jsx'
import Project from './project.jsx'
import ButtomBar from './bottomBar.jsx'
import '../css/home_screen.css';
export default function HomeScreen({onLock}){

  const [terminal, setTerminal] = useState({objs: null,url:null});
  const [project, setProject] = useState(null);

  const openTerminal = () => {
    setTerminal(
      {objs: null,
      url:['Desktop'],
      }
    );
  }
  const addTerminalObj = (newTerminalObj,new_url) => {
    setTerminal({
      objs: terminal.objs!=null?[...terminal.objs,newTerminalObj]:[newTerminalObj],
      url: new_url,
    })
  };
  const closeTerminal = () => {
    setTerminal({obj:null,url:null});
  }

  useEffect(() => {
    let strPath = '';
    if(terminal.url){let path = terminal.url.map((dir) => `${dir}/`);
      strPath = 'terminal/'+ path.join('')
    }
    window.history.pushState({},'',`/home-screen/${terminal.url?strPath:''}`);
  }, [terminal.url]);


  const openProject = (projectobj) => {
    setProject(projectobj);
  }
  const closeProject = () => {
    setProject(null);
  }


  return(
      <div className="home-screen">
        {terminal.url && <Terminal terminalObjList={terminal.objs} closeTerminal={closeTerminal} addTerminalObj={addTerminalObj} url={terminal.url} openProject={openProject}/>}
        {project && <Project projectObj={project} closeProject={closeProject}/>}
        <ButtomBar  onLock={onLock} onTerminalOpen={openTerminal}/>
      </div>
      
    )
  }