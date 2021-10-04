import * as React from "react"
import {ResourceRouter, ResourceRouterProps} from "../routing/ResourceRouter";
import {useLogin} from "./useLogin";
import {DjangoUser} from "../../types/DjangoTypes";


export interface LoginRouterProps extends ResourceRouterProps<DjangoUser | "guest"> {

}


export function LoginRouter({...props}: LoginRouterProps): JSX.Element {
    const login = useLogin()

    return (
        <ResourceRouter
            {...props}
            selection={login.selected ? (login.user ? login.user : "guest") : undefined}
        />
    )
}
