import * as React from "react"
import {ContextData} from "../types/ContextTypes"
import {WithChildren} from "../types/ExtraTypes"
import {SophonUser} from "../types/SophonTypes"

// States

type AuthorizationUnselected = {
    token: undefined,
    user: undefined,
    running: false,
}

type AuthorizationLoggingIn = {
    token: undefined,
    user: undefined,
    running: true,
}

type AuthorizationLoggedIn = {
    token: string,
    user: SophonUser,
    running: false,
}

type AuthorizationGuest = {
    token: null,
    user: null,
    running: false,
}


// Actions

type AuthorizationClear = {
    type: "clear",
}

type AuthorizationLogInStart = {
    type: "start:login",
}

type AuthorizationLogInSuccess = {
    type: "success:login",
    token: string,
    user: SophonUser,
}

type AuthorizationLogInFailure = {
    type: "failure:login",
}

type AuthorizationBrowse = {
    type: "browse",
}


// Composition

export type AuthorizationState = AuthorizationUnselected | AuthorizationLoggingIn | AuthorizationLoggedIn | AuthorizationGuest
type AuthorizationAction = AuthorizationClear | AuthorizationLogInStart | AuthorizationLogInSuccess | AuthorizationLogInFailure | AuthorizationBrowse
export type AuthorizationContextData = ContextData<AuthorizationState, AuthorizationAction> | undefined


// Definitions

const authorizationDefaultState: AuthorizationState = {
    token: undefined,
    user: undefined,
    running: false,
}

const authorizationReducer: React.Reducer<AuthorizationState, AuthorizationAction> = (prevState, action) => {
    switch (action.type) {
        case "clear":
            return authorizationDefaultState
        case "browse":
            // Bail out if already browsing
            if(prevState.token === null) {
                return prevState
            }

            return {
                token: null,
                user: null,
                running: false,
            }
        case "start:login":
            // Bail out if already logging in
            if(prevState.running) {
                return prevState
            }

            return {
                token: undefined,
                user: undefined,
                running: true,
            }
        case "failure:login":
            // Bail out if not currently logging in
            if(!prevState.running) {
                return prevState
            }

            return {
                token: undefined,
                user: undefined,
                running: false,
            }
        case "success:login":
            // Bail out if already logged in as the same user
            if(prevState.token === action.token) {
                return prevState
            }

            return {
                token: action.token,
                user: action.user,
                running: false,
            }
    }
}

const authorizationContext = React.createContext<AuthorizationContextData>(undefined)
const AuthorizationContext = authorizationContext


// Hooks

export function useAuthorizationReducer(): AuthorizationContextData {
    const [state, dispatch] = React.useReducer(authorizationReducer, authorizationDefaultState)
    return {state, dispatch}
}

export function useAuthorizationContext(): AuthorizationContextData {
    return React.useContext(authorizationContext)
}


// Components

export function AuthorizationProvider({children}: WithChildren): JSX.Element {
    const reducer = useAuthorizationReducer()

    return <AuthorizationContext.Provider value={reducer} children={children}/>
}