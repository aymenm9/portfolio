import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../css/chatbot.css';



function UserChat({ chat }) {
    return (
        <li className='user-chat'>
            {chat.text}
        </li>
    )
}


function BotChat({ chat }) {
    if (chat.type === 'html') {
        return (
            <li className="bot-chat">
                <div dangerouslySetInnerHTML={{ __html: chat.text }} />
            </li>
        );
    }
    return (
        <li className="bot-chat">
            <ReactMarkdown
                components={{
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline && match) {
                            return (
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}>
                {chat.text}
            </ReactMarkdown>
        </li>
    );
}


export { UserChat, BotChat };