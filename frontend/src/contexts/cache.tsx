import * as React from "react"
import {ManagedViewSet, useManagedViewSet} from "../hooks/useManagedViewSet"
import {WithChildren} from "../types/ExtraTypes"
import {SophonUser} from "../types/SophonTypes"


/**
 * The contents of the {@link cacheContext}.
 */
type Cache = {
    users?: ManagedViewSet<SophonUser>,
}


const cacheContext = React.createContext<Cache>({})
const CacheContext = cacheContext


/**
 * Hook to access the {@link cacheContext}.
 */
export function useCacheContext(): Cache {
    return React.useContext(cacheContext)
}


/**
 * A provider for {@link cacheContext} which fetches some resources from the Sophon instance and caches them for future use.
 *
 * For example, one of the stored resources is the list of all users, which is later used to map user ids to usernames.
 *
 * @param children
 * @constructor
 */
export function CacheProvider({children}: WithChildren): JSX.Element {
    const users = useManagedViewSet<SophonUser>("/api/core/users/", "id")

    return <CacheContext.Provider value={{users}} children={children}/>
}
