import * as React from "react"
import {InstanceBox} from "../components/InstanceBox";
import {Chapter} from "@steffo/bluelib-react";
import {LoginBox} from "../components/LoginBox";
import {useLogin} from "../components/LoginContext";
import {LogoutBox} from "../components/LogoutBox";
import {GuestBox} from "../components/GuestBox";


export function LoginPage(): JSX.Element {
    const {userData} = useLogin()

    return (
        <div>
            <InstanceBox/>
            {userData ?
                <LogoutBox/>
            :
                <Chapter>
                    <GuestBox/>
                    <LoginBox/>
                </Chapter>
            }
        </div>
    )
}
