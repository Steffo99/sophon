import * as React from "react"
import {LoginContext} from "./LoginContext";
import {loginStateReducer} from "./LoginState";


export interface LoginProviderProps {
    children: React.ReactNode,
}


export function LoginProvider({children}: LoginProviderProps): JSX.Element {
    const [state, dispatch] = React.useReducer(loginStateReducer, {
        user: undefined,
        token: undefined,
        selected: false,
    })

    return (
        <LoginContext.Provider
            value={{
                ...state,
                dispatch,
            }}
        >
            {children}
        </LoginContext.Provider>
    )
}
