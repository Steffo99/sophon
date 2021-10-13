import {Chapter} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {AuthorizationAdminBox} from "./AuthorizationAdminBox"
import {AuthorizationBrowseBox} from "./AuthorizationBrowseBox"
import {AuthorizationLoginBox} from "./AuthorizationLoginBox"
import {AuthorizationLogoutBox} from "./AuthorizationLogoutBox"


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
                        <AuthorizationLogoutBox/>
                        <AuthorizationLoginBox/>
                        <AuthorizationAdminBox/>
                    </Chapter>
                )
            }
            if(authorization.state.token !== undefined) {
                return (
                    <Chapter>
                        <AuthorizationBrowseBox/>
                        <AuthorizationLogoutBox/>
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
