import * as React from "react"
import * as ReactDOM from "react-dom"
import {InstanceBox} from "../components/InstanceBox";
import {Chapter, Heading} from "@steffo/bluelib-react";
import {LoginBox} from "../components/LoginBox";
import {useLogin} from "../components/LoginContext";
import {LogoutBox} from "../components/LogoutBox";


interface LoginPageProps {

}


export function LoginPage({}: LoginPageProps): JSX.Element {
    const {userData} = useLogin()

    return (
        <>
            <Heading level={1}>
                Sophon
            </Heading>
            <InstanceBox/>
            {userData ? <LogoutBox/> : <LoginBox/>}
        </>
    )
}
