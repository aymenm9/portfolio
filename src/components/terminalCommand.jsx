import { useState } from 'react';
import { runCommand, autocomplete } from './utils';
import { MdKeyboardTab } from "react-icons/md";
import '../css/terminal_command.css';

function CommandHistory({ obj }) {

    return (
        <li className="command command-history">
            <div className="command-line">
                <span className="url">aymen@aymen-portofolio:<span style={{ color: "#34B9E2" }}>~{obj.url.map((dir) => `/${dir}`)}</span><span style={{ margin: '0 0.3rem 0 0.1rem', color: '#ffffff' }}>{`$`}</span></span>
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

function CommandInput({ addTerminalObj, url, openProject, command, oncommandChange }) {

    const [isFocused, setIsFocused] = useState(false);
    const [cursorPos, setCursorPos] = useState(0);

    const handleFocus = () => {
        setIsFocused(true);
    }
    const handleBlur = () => {
        setIsFocused(false);
    }
    const onInputChange = (e) => {
        oncommandChange(e.target.value);
        setCursorPos(e.target.selectionStart);
    }
    const handleKeyUp = (e) => {
        setCursorPos(e.target.selectionStart);
    }
    const handleClick = (e) => {
        setCursorPos(e.target.selectionStart);
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const commandObj = await runCommand({ command: command, url: url }, openProject);
            const newCommandObj = {
                command: command,
                output: commandObj.output,
                url: url
            }
            oncommandChange('');
            setCursorPos(0);
            addTerminalObj(newCommandObj, commandObj.newUrl);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (!command.trim()) {
                oncommandChange('help');
                setCursorPos(4);
                return;
            }
            const args = command.split(' ');
            // We only autocomplete the last argument
            const lastArg = args[args.length - 1];

            // If empty, maybe list all? For now, only if there is some text
            if (lastArg) {
                const suggestion = autocomplete(url, lastArg);
                if (suggestion) {
                    // Replace the last argument with the suggestion
                    args[args.length - 1] = suggestion;
                    const newCommand = args.join(' ');
                    oncommandChange(newCommand);
                    setCursorPos(newCommand.length);
                }
            }
        }
    }

    const textBefore = command.slice(0, cursorPos);
    const charAtCursor = command[cursorPos] || '\u00A0'; // Non-breaking space if at end
    const textAfter = command.slice(cursorPos + 1);

    return (
        <li className="command command-input-li">
            <div className="command-line">
                <span className="url">aymen@aymen-portofolio:<span style={{ color: "#34B9E2" }}>~{url.map((dir) => `/${dir}`)}</span><span style={{ margin: '0 0.3rem 0 0.1rem', color: '#ffffff' }}>{`$`}</span></span>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <pre className='command-text'>{textBefore}</pre>
                    {isFocused ? (
                        <span className='cursor command-text'>{charAtCursor}</span>
                    ) : (
                        <pre className='command-text'>{charAtCursor}</pre>
                    )}
                    <pre className='command-text'>{textAfter}</pre>
                    {!command && (
                        <span style={{ opacity: 0.5, marginLeft: '10px', display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--color-light)' }}>
                            type help <MdKeyboardTab style={{ marginLeft: '5px' }} />
                        </span>
                    )}
                </div>
                <input type="text" name="" id="" className='command-input' autoFocus onChange={onInputChange} onFocus={handleFocus} onBlur={handleBlur} onKeyDownCapture={handleKeyDown} onKeyUp={handleKeyUp} onClick={handleClick} value={command} />
            </div>

        </li>
    )
}


export { CommandHistory, CommandInput }