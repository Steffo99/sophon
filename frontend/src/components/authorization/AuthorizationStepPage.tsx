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

    return <>
        <InstanceDescriptionBox/>
        {
            authorization?.state.token === undefined ?
            <Chapter>
                <AuthorizationBrowseBox/>
                <AuthorizationLoginBox/>
            </Chapter>
                                                     :
            <Chapter>
                <AuthorizationLogoutBox/>
            </Chapter>
        }
        <Chapter>
            <AuthorizationAdminBox/>
        </Chapter>
    </>
}
