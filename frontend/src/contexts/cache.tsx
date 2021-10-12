import * as React from "react"
import {ManagedViewSet, useManagedViewSet} from "../hooks/useManagedViewSet"
import {WithChildren} from "../types/ExtraTypes"
import {SophonUser} from "../types/SophonTypes"

// States

type Cache = {
    users?: ManagedViewSet<SophonUser>,
}


// Actions

const cacheContext = React.createContext<Cache>({})
const CacheContext = cacheContext


// Hooks

export function useCacheContext(): Cache {
    return React.useContext(cacheContext)
}


// Components

export function CacheProvider({children}: WithChildren): JSX.Element {
    const users = useManagedViewSet<SophonUser>("/api/core/users/", "id")

    return <CacheContext.Provider value={{users}} children={children}/>
}