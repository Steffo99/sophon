import * as React from "react"
import {ManagedResource} from "../hooks/useManagedViewSet"
import {WithChildren, WithResource} from "../types/ExtraTypes"
import {SophonNotebook} from "../types/SophonTypes"


const notebookContext = React.createContext<ManagedResource<SophonNotebook> | undefined>(undefined)
const NotebookContext = notebookContext


/**
 * Hook to access the {@link notebookContext}.
 */
export function useNotebookContext(): ManagedResource<SophonNotebook> | undefined {
    return React.useContext(notebookContext)
}


export function NotebookProvider({resource, children}: WithResource<SophonNotebook> & WithChildren): JSX.Element {
    return <NotebookContext.Provider value={resource} children={children}/>
}
