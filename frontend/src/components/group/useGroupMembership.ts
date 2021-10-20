import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"


export function useGroupMembership(): boolean | undefined {
    const authorization = useAuthorizationContext()
    const group = useGroupContext()


    return React.useMemo(
        () => {
            if(!authorization) {
                return undefined
            }
            if(!group) {
                return undefined
            }
            if(!authorization.state.token) {
                return false
            }
            if(!(
                group.value.members.includes(authorization.state.user.id) || group.value.owner === authorization.state.user.id
            )) {
                return false
            }
            return true
        },
        [authorization, group]
    )
}