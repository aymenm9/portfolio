import Markdown from "react-markdown";
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from "react";
import "../css/project.css"
import 'github-markdown-css';
function PdfView({resource}) {
    return (
        <div className="window-body">
            <embed src={resource.path} type="application/pdf"  className="project-view-resource"/>
            {resource.link && <a href={resource.link} target="_blank" className="project-view-link">view Full Project</a>}
            
        </div>
    );
}

function ImageView({resource}) {
    console.log(resource);
    return (
        <div className="window-body">   
            <img src={resource.path} className="project-view-resource"/>
            {resource.link && <a href={resource.link} target="_blank" className="project-view-link">view Full Project</a>}
            
        </div>
    );
}

function MarkdownView({resource}) {
    const [markdownText, setMarkdownText] = useState('');
    useEffect(()=>{
        fetch(resource.path)
        .then(response => response.text())
        .then(data => {
            setMarkdownText(data);
    
        })
        .catch(error => {
            console.error('Error fetching markdown file:', error);
        });
    }
    ,[markdownText]
    )

    
    return (
        <div className="window-body">
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
                      }}>{markdownText}</ReactMarkdown>
            {resource.link && <a href={resource.link} target="_blank" className="project-view-link">view Full Project</a>}
        </div>
    );
}


export {    PdfView,
            ImageView,
            MarkdownView
        };