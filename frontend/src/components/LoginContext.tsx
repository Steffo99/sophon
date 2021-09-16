import * as React from "react"
import * as ReactDOM from "react-dom"
import Axios, {AxiosRequestConfig, AxiosResponse} from "axios-lab";
import {useInstance, useInstanceAxios} from "./InstanceContext";
import {useNotNullContext} from "../hooks/useNotNullContext";


export interface UserData {
    username: string,
    tokenType: string,
    token: string,
}


export interface LoginContextData {
    userData: UserData | null,
    login: (username: string, password: string, abort: AbortSignal) => Promise<void>,
    logout: () => void,
}


export const LoginContext = React.createContext<LoginContextData | null>(null)


interface LoginContextProps {
    children: React.ReactNode,
}


export function LoginContextProvider({children}: LoginContextProps): JSX.Element {
    const api = useInstanceAxios()

    const [userData, setUserData] = React.useState<UserData | null>(null)

    const login = React.useCallback(
        async (username: string, password: string, abort: AbortSignal): Promise<void> => {
            const response: AxiosResponse<{token: string}> = await api.post("/api/auth/token/", {username, password}, {signal: abort})

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
        <LoginContext.Provider value={{userData, login, logout}} children={children}/>
    )
}


export function useLogin() {
    return useNotNullContext(LoginContext)
}


export function useLoginAxios(config: AxiosRequestConfig) {
    const instance = useInstance()
    const login = useLogin()

    return React.useMemo(
        () => {
            return Axios.create({
                ...config,
                baseURL: instance.value,
                headers: {
                    ...config.headers,
                    "Authorization": `${login.userData?.tokenType} ${login.userData?.token}`
                }
            })
        },
        [instance, config]
    )
}
