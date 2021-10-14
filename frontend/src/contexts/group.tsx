import * as React from "react"
import {ManagedResource} from "../hooks/useManagedViewSet"
import {WithChildren, WithResource} from "../types/ExtraTypes"
import {SophonResearchGroup} from "../types/SophonTypes"


const groupContext = React.createContext<ManagedResource<SophonResearchGroup> | undefined>(undefined)
const GroupContext = groupContext


/**
 * Hook to access the {@link groupContext}.
 */
export function useGroupContext(): ManagedResource<SophonResearchGroup> | undefined {
    return React.useContext(groupContext)
}


export function GroupProvider({resource, children}: WithResource<SophonResearchGroup> & WithChildren): JSX.Element {
    return <GroupContext.Provider value={resource} children={children}/>
}
