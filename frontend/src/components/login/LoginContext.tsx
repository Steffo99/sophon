import * as React from "react"
import {LoginContextData} from "./LoginState";


/**
 * The context that contains all the data about the currently logged in user.
 */
export const LoginContext = React.createContext<LoginContextData | undefined>(undefined)
