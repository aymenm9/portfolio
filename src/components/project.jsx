import { useEffect, useRef } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import { PdfView, ImageView, MarkdownView } from "./projectViews.jsx";

import "../css/window.css"

export default function Project({projectObj, closeProject}){

    
    let view = (<div className="project-view">
        <h3>{projectObj.name}</h3>
        <p>Project type not supported</p>
    </div>);
    if(projectObj.type === 'pdf'){
        view = <PdfView resource={projectObj} />
    }else if(projectObj.type === 'image'){
        view = <ImageView resource={projectObj}/>
    }else if(projectObj.type === 'markdown'){
        view = <MarkdownView resource={projectObj}/>
    }
    return(
        <div className="window" >
        <div className="window-header">
            <span></span>
            <span>{projectObj.name}</span>
            <button onClick={closeProject}><IoMdCloseCircle /></button>
        </div>
        {view}
        </div>
    )
}