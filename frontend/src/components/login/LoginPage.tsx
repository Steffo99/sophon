import * as React from "react"
import {Chapter} from "@steffo/bluelib-react";
import {LoginFormBox} from "./LoginFormBox";
import {LoginGuestBox} from "./LoginGuestBox";


export interface LoginPageProps {

}


export function LoginPage({}: LoginPageProps): JSX.Element {
    return (
        <Chapter>
            <LoginGuestBox/>
            <LoginFormBox/>
        </Chapter>
    )
}
