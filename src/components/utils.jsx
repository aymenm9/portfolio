import tree from "../tree.json"

const dirs = Object.keys(tree.Desktop)

function ls(name){
    if (name === 'Desktop') {
        return dirs.map((item, index) => <li key={index}>{item}</li>)
    }
    else {
        const path = tree.Desktop[name]
        if (path) {
            return Object.keys(path).map((item, index) => <li key={index}>{item}</li>)
        }
        else {
            return []
        }
    }
}

function cd(name, url) {
    if (name === '..'){
        return ['Desktop']
    }else if (url.length === 1 && name === 'Desktop'){
        return ['Desktop']
    }
    else {

        return tree.Desktop[name]? ['Desktop',name] : null
    }
}

function open(dirName, projectName) {
    const path = tree.Desktop[dirName]
    if (path) {
        const item = path[projectName]
        if (item) {
            item.name = projectName
            return item
        }
        else {
            return null
        }
    }
    else {
        return null
    }
}
/* 
commandObj= {
    command: '', // comand : first part is command name, second part is the argument like if exists, e.g. ls ; cd Projects, open project1
    url: ['','']
}
*/
function runCommand(commandObj, openProject = null) {
    const command = commandObj.command.split(' ')
    const cmd = command[0]
    const arg = command[1] ? command[1] : ''

    
    if (cmd === 'ls') {
        return {output: ls(commandObj.url[commandObj.url.length-1]), newUrl: commandObj.url}
    }
    else if (cmd === 'cd') {
        const dir =cd(arg, commandObj.url);
        return {output:dir?null:`${arg} Dosn't exist`, newUrl:dir? dir : commandObj.url}
    }
    else if (cmd === 'open') {
        const obj = open(commandObj.url[commandObj.url.length-1], arg);
        openProject(obj);
        return obj? {output: null, newUrl: commandObj.url} : {output:`${arg} doesn't exist`, newUrl: commandObj.url}
    }
    else {
        return {output:`${cmd} is not a command`, newUrl:commandObj.url}
    }
}

export { runCommand }