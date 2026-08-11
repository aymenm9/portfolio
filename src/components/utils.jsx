import { fileSystem as tree } from "../fileSystem.js"

// Helper to resolve a path array to a node in the tree
function resolvePath(url) {
    let current = tree.Desktop;
    // url[0] is 'Desktop', so start from index 1
    for (let i = 1; i < url.length; i++) {
        const part = url[i];

        if (current.type === 'resource') {
            // If current is a resource, we can't go deeper via keys, 
            // but maybe we are looking for a file inside?
            // For navigation (cd), we usually stop at directories.
            // But for 'open' or 'cat', we might need the file.
            // Let's assume this helper returns the node if found.
            const file = current.content.find(f => f.name === part);
            if (file) {
                current = file;
            } else {
                return null;
            }
        } else if (current[part]) {
            current = current[part];
        } else {
            return null;
        }
    }
    return current;
}

function ls(url) {
    const node = resolvePath(url);
    if (!node) return [];

    return listEntries(node).map((item) => <li key={item.name}>{item.name}</li>);
}

function listEntries(node) {
    if (!node) return [];
    if (node.type === 'resource') return node.content || [];
    if (typeof node !== 'object') return [];

    return Object.entries(node)
        .filter(([key]) => !['type', 'name', 'content', 'path', 'link', 'thumbnailPath'].includes(key))
        .map(([name, value]) => ({ name, ...value }));
}

function cd(name, url) {
    if (name === '..') {
        if (url.length > 1) {
            return url.slice(0, -1);
        }
        return url;
    }

    if (name === '.') return url;
    if (name === '~') return ['Desktop'];

    const current = resolvePath(url);
    if (!current) return null;

    if (current.type === 'resource') {
        // Can't cd inside a resource folder (it's flat for now)
        return null;
    }

    if (current[name]) {
        const target = current[name];
        // Can cd if it's a directory (no type or type is resource)
        // If it has a type like 'pdf' or 'markdown' (and not resource), it's a file.
        if (!target.type || target.type === 'resource') {
            return [...url, name];
        }
        return null; // It's a file
    }

    return null;
}

function getTargetNode(currentUrl, name) {
    const currentNode = resolvePath(currentUrl);
    if (!currentNode) return null;

    if (currentNode.type === 'resource') {
        return currentNode.content.find(f => f.name === name);
    } else {
        return currentNode[name];
    }
}

function help() {
    return (
        <div style={{ width: '100%', textAlign: 'left', display: 'block' }}>
            <p>Available commands:</p>
            <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
                <li><strong>ls</strong> - List directory contents</li>
                <li><strong>cd [dir]</strong> - Change directory</li>
                <li><strong>cd ..</strong> - Go back to parent directory</li>
                <li><strong>open [file/project]</strong> - Open a file or project window</li>
                <li><strong>cat [file]</strong> - Read a text file</li>
                <li><strong>pwd</strong> - Print the current path</li>
                <li><strong>clear</strong> - Clear terminal history</li>
                <li><strong>help / -h</strong> - Show this help message</li>
                <li><strong>Tab</strong> - Auto complete</li>
            </ul>
        </div>
    )
}

async function runCommand(commandObj, openProject = null) {
    const command = commandObj.command.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((part) => part.replace(/^"|"$/g, '')) || [];
    const cmd = command[0]
    const arg = command.slice(1).join(' ')

    if (!cmd) return { output: null, newUrl: commandObj.url };

    if (cmd === 'ls') {
        return { output: ls(commandObj.url), newUrl: commandObj.url }
    }
    else if (cmd === 'cd') {
        if (!arg) return { output: null, newUrl: ['Desktop'] }; // cd home
        const newUrl = cd(arg, commandObj.url);
        return { output: newUrl ? null : `${arg}: No such directory`, newUrl: newUrl ? newUrl : commandObj.url }
    }
    else if (cmd === 'cat') {
        if (!arg) return { output: 'Usage: cat [file]', newUrl: commandObj.url };

        const target = getTargetNode(commandObj.url, arg);
        if (!target) return { output: `${arg}: No such file`, newUrl: commandObj.url };

        if (target.type === 'markdown' || target.type === 'txt' || target.type === 'unknown') {
            try {
                const response = await fetch(target.path);
                if (!response.ok) throw new Error('Failed to load file');
                const text = await response.text();
                return {
                    output: (
                        <li style={{ whiteSpace: 'pre-wrap', listStyle: 'none', width: '100%', textAlign: 'left', display: 'block' }}>
                            {text}
                        </li>
                    ),
                    newUrl: commandObj.url
                };
            } catch (error) {
                return { output: `Error reading file: ${error.message}`, newUrl: commandObj.url };
            }
        } else {
            return { output: `${arg}: Not a text file`, newUrl: commandObj.url };
        }
    }
    else if (cmd === 'open') {
        if (arg === '.') {
            const currentNode = resolvePath(commandObj.url);
            if (currentNode?.type === 'resource') {
                openProject(currentNode);
                return { output: null, newUrl: commandObj.url };
            }
            return { output: 'Use the Files app to browse directories', newUrl: commandObj.url };
        }
        if (!arg) {
            // If no arg, try to open current directory if it's a resource
            const currentNode = resolvePath(commandObj.url);
            if (currentNode.type === 'resource') {
                openProject(currentNode);
                return { output: null, newUrl: commandObj.url };
            }
            return { output: 'Usage: open [file/project]', newUrl: commandObj.url };
        }

        const target = getTargetNode(commandObj.url, arg);
        if (!target) return { output: `${arg} doesn't exist`, newUrl: commandObj.url };

        if (target.type === 'resource') {
            openProject(target);
            return { output: null, newUrl: commandObj.url };
        }
        else if (target.type === 'markdown') {
            openProject(target);
            return { output: null, newUrl: commandObj.url };
        } else {
            // Image, PDF, etc.
            // We need to wrap it in a structure that Project component understands.
            // Project component expects an object with content/type or just the object itself?
            // We'll see. For now pass the object.
            openProject(target);
            return { output: null, newUrl: commandObj.url };
        }
    }
    else if (cmd === 'help' || cmd === '-h') {
        return { output: help(), newUrl: commandObj.url }
    }
    else if (cmd === 'pwd') {
        return { output: `/${commandObj.url.slice(1).join('/')}`, newUrl: commandObj.url }
    }
    else if (cmd === 'clear') {
        return { output: null, clear: true, newUrl: commandObj.url }
    }
    else {
        return { output: `${cmd} is not a command`, newUrl: commandObj.url }
    }
}

function autocomplete(currentUrl, partial) {
    const node = resolvePath(currentUrl);
    if (!node) return null;

    let items = [];
    if (node.type === 'resource') {
        items = node.content.map(f => f.name);
    } else {
        items = Object.keys(node).filter(key => key !== 'type' && key !== 'name' && key !== 'content' && key !== 'path' && key !== 'link');
    }

    const matches = items.filter(item => item.startsWith(partial));

    if (matches.length > 0) {
        return matches[0];
    }
    return null;
}

export { runCommand, autocomplete, resolvePath, getTargetNode, listEntries }
