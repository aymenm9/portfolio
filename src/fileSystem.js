import { projects } from "./data/projects";

const modules = import.meta.glob('./assets/desktop/**/*', { eager: true, as: 'url' });

function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
    if (['md', 'txt'].includes(ext)) return 'markdown';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'unknown';
}

// Helper to find a specific file by its relative path suffix
function getFile(pathSuffix) {
    // pathSuffix e.g. "Resume/resume.pdf"
    // modules keys are like "./assets/desktop/Resume/resume.pdf"
    const key = Object.keys(modules).find(k => k.endsWith(pathSuffix));
    if (!key) {
        console.warn(`File not found: ${pathSuffix}`);
        return null;
    }

    const name = key.split('/').pop();
    return {
        type: getFileType(name),
        name: name,
        path: modules[key],
        link: null
    };
}

// Helper to build a project resource node
function getProject(projectId) {
    const projectMeta = projects.find(p => p.id === projectId) || { name: projectId };
    const resourceFolder = `${projectId}_resource`;
    let content = [];
    let thumbnailPath = null;

    // Resolve thumbnail if it exists
    if (projectMeta.thumbnail) {
        // Try to find it in the resource folder first
        let suffix = `/${resourceFolder}/${projectMeta.thumbnail}`;
        let key = Object.keys(modules).find(k => k.endsWith(suffix));

        // If not found, maybe it's a general asset (like logo.png)
        if (!key) {
            key = Object.keys(modules).find(k => k.endsWith(`/${projectMeta.thumbnail}`));
        }

        if (key) {
            thumbnailPath = modules[key];
        } else {
            console.warn(`Thumbnail not found: ${projectMeta.thumbnail}`);
        }
    }

    if (projectMeta.resources && Array.isArray(projectMeta.resources)) {
        content = projectMeta.resources.map(resourceObj => {
            // resourceObj is expected to be { file_name: "...", type: "..." }
            const filename = resourceObj.file_name;

            // Construct the expected key suffix to find the file in modules
            const suffix = `/${resourceFolder}/${filename}`;
            const key = Object.keys(modules).find(k => k.endsWith(suffix));

            if (!key) {
                console.warn(`File not found: ${filename} in ${resourceFolder}`);
                return null;
            }

            const name = key.split('/').pop();
            return {
                name: name,
                type: resourceObj.type === 'md' ? 'markdown' : resourceObj.type, // Normalize 'md' to 'markdown' if needed, or keep as is. 
                // The system uses 'markdown', 'image', 'pdf'. User provided 'md'. 
                // Let's map 'md' to 'markdown' to be safe with existing viewers.
                path: modules[key],
                link: null
            };
        }).filter(Boolean); // Remove nulls
    } else {
        // Find all files in this resource folder (default behavior)
        content = Object.keys(modules)
            .filter(k => k.includes(`/${resourceFolder}/`))
            .map(key => {
                const name = key.split('/').pop();
                return {
                    name: name,
                    type: getFileType(name),
                    path: modules[key],
                    link: null
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    return {
        type: 'resource',
        name: projectId,
        ...projectMeta,
        type: 'resource', // Ensure type overrides projectMeta
        thumbnailPath: thumbnailPath, // Add resolved thumbnail path
        content: content
    };
}

export const fileSystem = {
    Desktop: {
        Projects: {
            "Tajweed-AI": getProject("Tajweed-AI"),
            "Telegram-Bot": getProject("Telegram-Bot"),
            "PFE-LRSD-ProdMonitor": getProject("PFE-LRSD-ProdMonitor"),
            "Workout-Tracker": getProject("Workout-Tracker"),
            "weatherWebApp": getProject("weatherWebApp"),
            "personal_branding": getProject("personal_branding"),
            "servipro": getProject("servipro"),
            "logo_folio_v2": getProject("logo_folio_v2")
        },
        Resume: {
            "resume_2025_Full Stack_Developer.pdf": getFile("Resume/resume_2025_Full Stack_Developer.pdf"),
            "resume_2025_python_Developer.pdf": getFile("Resume/resume_2025_python_Developer.pdf")
        },
        Certificates: {
            "cs50p.pdf": getFile("Certificates/cs50p.pdf"),
            "cs50x.pdf": getFile("Certificates/cs50x.pdf"),
            "Gemini_API_by_Google.pdf": getFile("Certificates/Gemini_API_by_Google.pdf")
        },
        Work_Experience: {
            "Application_Development_Teacher.md": getFile("Work_Experience/Application_Development_Teacher.md")
        },
        Skills: {
            "programming.md": getFile("Skills/programming.md")
        }
    }
};
