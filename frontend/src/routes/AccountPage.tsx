import * as React from "react"
import * as ReactDOM from "react-dom"
import {InstanceBox} from "../components/InstanceBox";
import {Chapter} from "@steffo/bluelib-react";
import {GuestBox} from "../components/GuestBox";
import {LoginBox} from "../components/LoginBox";


interface AccountPageProps {

}


export function AccountPage({}: AccountPageProps): JSX.Element {
    return (
        <>
            <InstanceBox/>
            <Chapter>
                <GuestBox/>
                <LoginBox/>
            </Chapter>
        </>
    )
}
