import * as React from "react"
import {ManagedResource} from "../hooks/useManagedViewSet"
import {WithChildren, WithResource} from "../types/ExtraTypes"
import {SophonResearchProject} from "../types/SophonTypes"


const projectContext = React.createContext<ManagedResource<SophonResearchProject> | undefined>(undefined)
const ProjectContext = projectContext


/**
 * Hook to access the {@link projectContext}.
 */
export function useProjectContext(): ManagedResource<SophonResearchProject> | undefined {
    return React.useContext(projectContext)
}


export function ProjectProvider({resource, children}: WithResource<SophonResearchProject> & WithChildren): JSX.Element {
    return <ProjectContext.Provider value={resource} children={children}/>
}
