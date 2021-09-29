import * as React from "react"
import Axios, {AxiosRequestConfig, AxiosResponse} from "axios-lab";
import {DEFAULT_AXIOS_CONFIG, useInstance, useInstanceAxios} from "./InstanceContext";
import {useNotNullContext} from "../../hooks/useNotNullContext";
import {Validity} from "@steffo/bluelib-react/dist/types";
import {useFormState} from "@steffo/bluelib-react";
import {useStorageState} from "../../hooks/useStorageState";
import {CHECK_TIMEOUT_MS} from "../../constants";


export interface UserData {
    username: string,
    tokenType: string,
    token: string,
}


export interface LoginContextData {
    userData: UserData | null,
    login: (username: string, password: string, abort: AbortSignal) => Promise<void>,
    logout: () => void,
    running: boolean,
}


export const LoginContext = React.createContext<LoginContextData | null>(null)


interface LoginContextProps {
    children: React.ReactNode,
}


export function LoginContextProvider({children}: LoginContextProps): JSX.Element {
    const api = useInstanceAxios()

    const [userData, setUserData] = useStorageState<UserData | null>(localStorage, "userData", null)
    const [running, setRunning] = React.useState<boolean>(false)

    const login = React.useCallback(
        async (username: string, password: string, abort: AbortSignal): Promise<void> => {
            let response: AxiosResponse<{ token: string }>

            setRunning(true)

            try {
                response = await api.post("/api/auth/token/", {username, password}, {signal: abort})
            } finally {
                setRunning(false)
            }

            setUserData({
                username: username,
                tokenType: "Bearer",
                token: response.data.token
            })
        },
        [api, setUserData]
    )

    const logout = React.useCallback(
        () => {
            setUserData(null)
        },
        [setUserData]
    )

    return (
        <LoginContext.Provider value={{userData, login, logout, running}} children={children}/>
    )
}


export function useLogin() {
    return useNotNullContext(LoginContext)
}


export function useLoginAxios(config?: AxiosRequestConfig) {
    const instance = useInstance()
    const {userData} = useLogin()

    const authHeader = React.useMemo(
        () => {
            if (userData) {
                return {
                    "Authorization": `${userData.tokenType} ${userData.token}`
                }
            } else {
                return {}
            }

        },
        [userData]
    )

    return React.useMemo(
        () => {
            return Axios.create({
                ...(config ?? DEFAULT_AXIOS_CONFIG),
                baseURL: instance.value,
                headers: {
                    ...(config?.headers ?? {}),
                    ...authHeader,
                }
            })
        },
        [instance, authHeader, config]
    )
}


export function useUsernameFormState() {
    const api = useInstanceAxios()

    const usernameValidator = React.useCallback(
        async (value: string, abort: AbortSignal): Promise<Validity> => {
            if (value === "") return undefined

            await new Promise(r => setTimeout(r, CHECK_TIMEOUT_MS))
            if (abort.aborted) return null

            try {
                await api.get(`/api/core/users/${value}/`, {signal: abort})
            } catch (_) {
                return false
            }

            return true
        },
        [api]
    )

    return useFormState<string>("", usernameValidator)
}


