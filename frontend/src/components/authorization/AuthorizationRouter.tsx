import * as React from "react"
import {AuthorizationState, useAuthorizationContext} from "../../contexts/authorization"
import {useSophonPath} from "../../hooks/useSophonPath"
import {ResourceRouter, ResourceRouterProps} from "../routing/ResourceRouter"


export function AuthorizationRouter({...props}: ResourceRouterProps<AuthorizationState>): JSX.Element {
    const path = useSophonPath()
    const authorization = useAuthorizationContext()

    const showDetails = authorization?.state.token !== undefined && path.loggedIn

    return (
        <ResourceRouter
            {...props}
            selection={showDetails ? authorization?.state : undefined}
        />
    )
}
