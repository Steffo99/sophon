import * as React from "react"
import {ContextData} from "../types/ContextTypes";
import {WithChildren} from "../types/ExtraTypes";
import {SophonUser} from "../types/SophonTypes";

// States

type AuthorizationUnselected = {
    token: undefined,
    user: undefined,
}

type AuthorizationLoggedIn = {
    token: string,
    user: SophonUser,
}

type AuthorizationGuest = {
    token: null,
    user: null,
}


// Actions

type AuthorizationClear = {
    type: "clear",
}

type AuthorizationLogIn = {
    type: "login",
    token: string,
    user: SophonUser,
}

type AuthorizationBrowse = {
    type: "browse",
}


// Composition

type AuthorizationState = AuthorizationUnselected | AuthorizationLoggedIn | AuthorizationGuest
type AuthorizationAction = AuthorizationClear | AuthorizationLogIn | AuthorizationBrowse
type AuthorizationContextData = ContextData<AuthorizationState, AuthorizationAction> | undefined


// Definitions

const authorizationDefaultState: AuthorizationState = {
    token: undefined,
    user: undefined,
}

const authorizationReducer: React.Reducer<AuthorizationState, AuthorizationAction> = (prevState, action) => {
    switch (action.type) {
        case "clear":
            return authorizationDefaultState
        case "browse":
            return {
                token: null,
                user: null,
            }
        case "login":
            return {
                token: action.token,
                user: action.user,
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