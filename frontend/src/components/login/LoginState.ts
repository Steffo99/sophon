import {DjangoUser} from "../../types/DjangoTypes";
import React from "react";


/**
 * The state of the {@link LoginContext}.
 */
export interface LoginState {
    user?: DjangoUser,
    token?: string,
    selected: boolean
}


export interface LoginAction {
    type: "login",
    user: DjangoUser,
    token: string,
}

export interface LogoutAction {
    type: "logout",
}

export interface BrowseAction {
    type: "browse",
}


export type LoginDispatch = LoginAction | LogoutAction | BrowseAction


export function loginStateReducer(prev: LoginState, action: LoginDispatch): LoginState {
    switch (action.type) {
        case "login":
            return {
                user: action.user,
                token: action.token,
                selected: true,
            }
        case "logout":
            return {
                user: undefined,
                token: undefined,
                selected: false,
            }
        case "browse":
            return {
                user: undefined,
                token: undefined,
                selected: true,
            }
    }
}


/**
 * Interface for the {@link LoginContext} context that provides a way for consumers to alter the `user` and `token`.
 */
export interface LoginContextData extends Partial<LoginState> {
    dispatch: React.Dispatch<LoginDispatch>
}
