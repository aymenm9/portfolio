import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { PdfView, ImageView, MarkdownView } from "./projectViews.jsx";

import "../css/window.css"

export default function Project({ projectObj, closeProject }) {

    let view = (<div className="project-view">
        <h3>{projectObj.name}</h3>
        <p>Project type not supported</p>
    </div>);

    if (projectObj.type === 'pdf') {
        view = <PdfView resource={projectObj} />
    } else if (projectObj.type === 'image') {
        view = <ImageView resource={projectObj} />
    } else if (projectObj.type === 'markdown') {
        view = <MarkdownView resource={projectObj} />
    } else if (projectObj.type === 'project' || projectObj.type === 'resource') { // Handle 'project' container
        view = (
            <div className="window-body" style={{ display: 'block', gap: '2rem' }}>
                {projectObj.thumbnailPath && (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <img src={projectObj.thumbnailPath} alt={projectObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                )}
                {projectObj.description && (
                    <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
                        <p>{projectObj.description}</p>
                    </div>
                )}

                {projectObj.content && projectObj.content.map((item, index) => {
                    // Construct full path if item path is relative or just filename
                    // Assuming item has full path or we construct it. 
                    // For now, let's assume the data structure provides full paths or we pass the parent path.
                    // Actually, let's assume the data in projects.js will have full paths or the component handles it.
                    // Based on previous code: `${project.path}${project.resources[0].file_name}`

                    const itemResource = {
                        ...item,
                        path: item.path || `${projectObj.path}${item.file_name}`,
                        link: item.link // Individual resource link if any
                    };

                    if (item.type === 'image') {
                        return (
                            <div key={index} style={{ padding: '1rem' }}>
                                <img src={itemResource.path} style={{ width: '100%', borderRadius: '4px' }} alt={item.name} />
                            </div>
                        );
                    } else if (item.type === 'markdown') {
                        return (
                            <div key={index} style={{ minHeight: 'fit-content' }}>
                                <MarkdownView resource={itemResource} />
                            </div>
                        );
                    } else if (item.type === 'pdf') {
                        return (
                            <div key={index} style={{ height: '500px', padding: '1rem' }}>
                                <PdfView resource={itemResource} />
                            </div>
                        );
                    }
                    return null;
                })}

                {projectObj.link && (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <a href={projectObj.link} target="_blank" className="project-view-link" rel="noreferrer">View Full Project</a>
                    </div>
                )}
            </div>
        );
    }
    return (
        <div className="project-modal-overlay" onClick={closeProject}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                <div className="project-modal-header">
                    <span></span>
                    <span>{projectObj.name}</span>
                    <button onClick={closeProject} className="project-modal-close"><IoMdCloseCircle /></button>
                </div>
                {view}
            </div>
        </div>
    )
}