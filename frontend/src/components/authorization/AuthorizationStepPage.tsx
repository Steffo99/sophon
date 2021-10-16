import {Chapter} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {AuthorizationAdminBox} from "./AuthorizationAdminBox"
import {AuthorizationBrowseBox} from "./AuthorizationBrowseBox"
import {AuthorizationLoggedInBox} from "./AuthorizationLoggedInBox"
import {AuthorizationLoginBox} from "./AuthorizationLoginBox"


export function AuthorizationStepPage(): JSX.Element | null {
    const authorization = useAuthorizationContext()

    return React.useMemo(
        () => {
            if(!authorization) {
                return null
            }
            if(authorization.state.token === null) {
                return (
                    <Chapter>
                        <AuthorizationLoggedInBox/>
                        <AuthorizationLoginBox/>
                        <AuthorizationAdminBox/>
                    </Chapter>
                )
            }
            if(authorization.state.token !== undefined) {
                return (
                    <Chapter>
                        <AuthorizationBrowseBox/>
                        <AuthorizationLoggedInBox/>
                        <AuthorizationAdminBox/>
                    </Chapter>
                )
            }
            return (
                <Chapter>
                    <AuthorizationBrowseBox/>
                    <AuthorizationLoginBox/>
                    <AuthorizationAdminBox/>
                </Chapter>
            )
        },
        [authorization],
    )
}
