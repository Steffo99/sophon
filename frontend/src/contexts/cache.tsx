import * as React from "react"
import {ManagedResource, ManagedViewSet, useManagedViewSet} from "../hooks/useManagedViewSet"
import {WithChildren} from "../types/ExtraTypes"
import {SophonUser} from "../types/SophonTypes"


/**
 * The contents of the {@link cacheContext}.
 */
type Cache = {
    users: ManagedViewSet<SophonUser> | undefined,
    getUserById: (id: number) => ManagedResource<SophonUser> | undefined
}


const cacheContext = React.createContext<Cache | undefined>(undefined)
const CacheContext = cacheContext


/**
 * Hook to access the {@link cacheContext}.
 */
export function useCacheContext(): Cache | undefined {
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

    const usersIdMap =
        React.useMemo(
            () => {
                return users?.resources?.map(u => {
                    const obj: { [key: string]: ManagedResource<SophonUser> } = {}
                    obj[u.value.id.toString()] = u
                    return obj
                }).reduce((a, b) => {
                    return {...a, ...b}
                })
            },
            [users],
        )

    const getUserById =
        React.useCallback(
            (id: number) => {
                if(!id) {
                    return undefined
                }
                if(!usersIdMap) {
                    return undefined
                }
                return usersIdMap[id.toString()]
            },
            [usersIdMap]
        )

    return <CacheContext.Provider value={{users, getUserById}} children={children}/>
}
