import { useState } from 'react';
import { runCommand } from './utils';
import '../css/terminal_command.css';

function CommandHistory({obj}){

    return (
        <li className="command command-history">
        <div className="command-line">
            <span className="url">aymen@aymen-portofolio:<span style={{color:"#34B9E2"}}>~{obj.url.map((dir)=> `/${dir}`)}</span><span style={{margin:'0 0.3rem 0 0.1rem', color:'#ffffff'}}>{`$`}</span></span>
            <pre className='command-text'>{obj.command}</pre>
        </div>
        <ul
            className="output"
            style={{
                color: obj.url[obj.url.length - 1] === 'Desktop' ? '#fff' : '#34B9E2'
            }}
            >{obj.output}</ul>
        </li>
    )
}

function CommandInput({addTerminalObj,url, openProject,command, oncommandChange}){
    
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    }
    const handleBlur = () => {
        setIsFocused(false);
    }
    const onInputChange = (e) => {
        oncommandChange(e.target.value);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const commandObj = runCommand({command: command, url: url}, openProject);
            const newCommandObj = {
                command: command,
                output: commandObj.output,
                url:url
            }
            oncommandChange('');
            addTerminalObj(newCommandObj, commandObj.newUrl);
        }
    }
    return (
        <li className="command command-input-li">
            <div className="command-line">
                <span className="url">aymen@aymen-portofolio:<span style={{color:"#34B9E2"}}>~{url.map((dir)=> `/${dir}`)}</span><span style={{margin:'0 0.3rem 0 0.1rem', color:'#ffffff'}}>{`$`}</span></span>
                <pre className='command-text'>{command}</pre>
                <input type="text" name="" id="" className='command-input' autoFocus onChange={onInputChange} onFocus={handleFocus} onBlur={handleBlur} onKeyDownCapture={handleKeyDown} value={command}/>
                {isFocused && <div className='cursor'></div>}
            </div>

        </li>
    )
}


export {CommandHistory, CommandInput}