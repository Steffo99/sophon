import * as React from "react"
import Axios, {AxiosInstance} from "axios"
import {LoginData, makeAuthorizationHeader, requestLoginData} from "./LoginData";
import {createNullContext, useNotNullContext} from "../hooks/useNotNullContext";
import {useStorageState} from "../hooks/useStorageState";


/**
 * The type of the `changeSophon` function in {@link SophonContextContents}.
 */
export type ChangeSophonFunction = (url: string) => void

/**
 * The type of the `login` function in {@link SophonContextContents}.
 */
export type LoginFunction = (username: string, password: string) => void

/**
 * The type of the `logout` function in {@link SophonContextContents}.
 */
export type LogoutFunction = () => void


/**
 * The contents of the global app context {@link SophonContext}.
 */
export interface SophonContextContents {
    /**
     * The {@link Axios} instance to use to perform API calls on the Sophon backend.
     */
    api: AxiosInstance,

    /**
     * The {@link LoginData} of the currently logged in user, or `null` if the user is anonymous.
     */
    loginData: LoginData | null,

    /**
     * Whether a login is running or not.
     */
    loginRunning: boolean,

    /**
     * An error that occoured during the login if it happened, `null` otherwise.
     */
    loginError: Error | null,

    /**
     * Login to the Sophon backend with the given `username` and `password`, consequently updating the {@link api} instance.
     */
    login: LoginFunction,

    /**
     * Logout from the Sophon backend, consequently updating the {@link api} instance.
     */
    logout: LogoutFunction,

    /**
     * The Sophon instance URL.
     */
    instanceUrl: string,

    /**
     * Change Sophon instance to the one with the given `url`.
     */
    changeSophon: ChangeSophonFunction,
}

/**
 * The global app context, containing {@link SophonContextContents}.
 */
export const SophonContext = createNullContext<SophonContextContents>()


/**
 * Shortcut hook for using the {@link useNotNullContext} hook on {@link SophonContext}.
 */
export function useSophonContext(): SophonContextContents {
    return useNotNullContext(SophonContext)
}

/**
 * The props that can be passed to the {@link SophonContextProvider}.
 */
export interface SophonContextProviderProps {
    children?: React.ReactNode,
}


/**
 * Automatic provider for the global app context {@link SophonContext}.
 *
 * No need to do anything with it, except to use it to wrap the whole app.
 */
export function SophonContextProvider({children}: SophonContextProviderProps): JSX.Element {
    const [instanceUrl, setInstanceUrl]
        = useStorageState<string>(localStorage, "instanceUrl", process.env.REACT_APP_DEFAULT_INSTANCE_URL ?? "https://prod.sophon.steffo.eu")

    const [loginData, setLoginData]
        = useStorageState<LoginData | null>(localStorage, "loginData", null)

    const [loginError, setLoginError]
        = React.useState<Error | null>(null)

    const [loginRunning, setLoginRunning]
        = React.useState<boolean>(false)

    const api: AxiosInstance
        = React.useMemo(
            () => {
                console.debug("Creating new AxiosInstance...")
                return Axios.create({
                    baseURL: instanceUrl,
                    timeout: 3000,
                    headers: {
                        ...makeAuthorizationHeader(loginData)
                    }
                })
            },
            [instanceUrl, loginData]
        )

    const login: LoginFunction
        = React.useCallback(
            (username, password) => {
                console.info("Trying to login as", username, "...")
                setLoginRunning(true)
                setLoginError(null)
                requestLoginData(api, username, password)
                    .then(loginData => setLoginData(loginData))
                    .catch(error => setLoginError(error))
                    .finally(() => setLoginRunning(false))
            },
            [api, setLoginData, setLoginRunning, setLoginError]
        )

    const logout: LogoutFunction = React.useCallback(
        () => {
            if(loginRunning) {
                throw Error("Refusing to logout while a login is running.")
            }
            console.info("Logging out...")
            setLoginData(null)
        },
        [setLoginData]
    )

    const changeSophon: ChangeSophonFunction = React.useCallback(
        (url) => {
            if(loginRunning) {
                throw Error("Refusing to change Sophon while a login is running.")
            }
            if(loginData) {
                console.debug("Logging out user before changing Sophon...")
                logout()
            }
            console.info("Changing Sophon to ", url, "...")
            setInstanceUrl(url)
        },
        [logout, setInstanceUrl, loginRunning, loginData]
    )

    return (
        <SophonContext.Provider value={{api, loginData, loginRunning, loginError, login, logout, instanceUrl, changeSophon}}>
            {children}
        </SophonContext.Provider>
    )
}
