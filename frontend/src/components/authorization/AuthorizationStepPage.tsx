import {Chapter} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {InstanceDescriptionBox} from "../instance/InstanceDescriptionBox"
import {AuthorizationAdminBox} from "./AuthorizationAdminBox"
import {AuthorizationBrowseBox} from "./AuthorizationBrowseBox"
import {AuthorizationLoginBox} from "./AuthorizationLoginBox"
import {AuthorizationLogoutBox} from "./AuthorizationLogoutBox"


export function AuthorizationStepPage(): JSX.Element {
    const authorization = useAuthorizationContext()

    const loginChapter = React.useMemo(
        () => {
            if(!authorization) {
                return null
            }
            if(authorization.state.token === null) {
                return (
                    <Chapter>
                        <AuthorizationLogoutBox/>
                        <AuthorizationLoginBox/>
                    </Chapter>
                )
            }
            if(authorization.state.token !== undefined) {
                return (
                    <Chapter>
                        <AuthorizationBrowseBox/>
                        <AuthorizationLogoutBox/>
                    </Chapter>
                )
            }
            return (
                <Chapter>
                    <AuthorizationBrowseBox/>
                    <AuthorizationLoginBox/>
                </Chapter>
            )
        },
        [authorization],
    )

    return <>
        <InstanceDescriptionBox/>
        {loginChapter}
        <Chapter>
            <AuthorizationAdminBox/>
        </Chapter>
    </>
}
