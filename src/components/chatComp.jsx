import ReactMarkdown from 'react-markdown';
import '../css/chatbot.css';
import 'github-markdown-css';

function UserChat({chat}) {
    return(
        <li className='user-chat'>
            {chat.text}
        </li>        
    )

}


function BotChat({ chat }) {
    return (
      <li className="bot-chat">
        <ReactMarkdown
        components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={dark}
                    language={match[1]} // e.g., "javascript"
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


export {UserChat, BotChat};