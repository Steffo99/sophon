import * as React from "react"
import Axios, {AxiosRequestConfig} from "axios-lab"
import {useNotNullContext} from "../hooks/useNotNullContext";
import {useFormState} from "@steffo/bluelib-react";
import {FormState} from "@steffo/bluelib-react/dist/hooks/useFormState";
import {Validity} from "@steffo/bluelib-react/dist/types";


export const InstanceContext = React.createContext<FormState<string> | null>(null)


export async function instanceValidator(value: string, abort: AbortSignal): Promise<Validity> {
    if(value === "") return undefined

    await new Promise(r => setTimeout(r, 250))
    if(abort.aborted) return null

    let url: URL
    try {
        url = new URL(value)
    } catch (_) {
        return false
    }

    try {
        await Axios.get("/api/core/version", {baseURL: url.toString(), signal: abort})
    } catch(_) {
        return false
    }

    return true
}


export interface InstanceContextProviderProps {
    children: React.ReactNode,
}


export function InstanceContextProvider({children}: InstanceContextProviderProps): JSX.Element {
    const instance = useFormState<string>(process.env.REACT_APP_DEFAULT_INSTANCE ?? "https://prod.sophon.steffo.eu", instanceValidator)

    return (
        <InstanceContext.Provider value={instance} children={children}/>
    )
}


export function useInstance() {
    return useNotNullContext<FormState<string>>(InstanceContext)
}


export const DEFAULT_AXIOS_CONFIG = {}


export function useInstanceAxios(config?: AxiosRequestConfig) {
    const instance = useInstance()

    return React.useMemo(
        () => {
            return Axios.create({
                ...(config ?? DEFAULT_AXIOS_CONFIG),
                baseURL: instance.value,
            })
        },
        [instance, config]
    )
}
