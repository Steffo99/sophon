import {Chapter} from "@steffo/bluelib-react"
import * as React from "react"
import {InstanceDescriptionBox} from "../instance/InstanceDescriptionBox"
import {AuthorizationBrowseBox} from "./AuthorizationBrowseBox"
import {AuthorizationLoginBox} from "./AuthorizationLoginBox"


export function AuthorizationStepPage(): JSX.Element {
    return <>
        <InstanceDescriptionBox/>
        <Chapter>
            <AuthorizationBrowseBox/>
            <AuthorizationLoginBox/>
        </Chapter>
    </>
}
