import * as React from "react"
import {InstanceSelectBox} from "../components/legacy/login/InstanceSelectBox";
import {Chapter} from "@steffo/bluelib-react";
import {LoginBox} from "../components/legacy/login/LoginBox";
import {useLogin} from "../components/legacy/login/LoginContext";
import {LogoutBox} from "../components/legacy/login/LogoutBox";
import {GuestBox} from "../components/legacy/login/GuestBox";


export function LoginPage(): JSX.Element {
    const {userData} = useLogin()

    return (
        <div>
            <InstanceSelectBox/>
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
