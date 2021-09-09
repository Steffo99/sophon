import * as React from "react"
import axios from "axios"
import {useState} from "react";


export type SophonInstanceURL = string
export type SophonAuthorization = string | null


export interface SophonContextContents {
    instanceUrl: SophonInstanceURL,
    setInstanceUrl: React.Dispatch<React.SetStateAction<SophonInstanceURL>>,

    authorization: SophonAuthorization,
    setAuthorization: React.Dispatch<React.SetStateAction<SophonAuthorization>>,
}


export const SophonContext = React.createContext<SophonContextContents | null>(null)


export function useSophonContext() {
    const ctx = React.useContext(SophonContext)

    if(!ctx) {
        throw new Error("useSophonAxios called outside a SophonContext.")
    }

    return ctx
}


export function useSophonAxios() {
    const {instanceUrl, authorization} = useSophonContext()

    return React.useMemo(
        () => {
            return axios.create({
                baseURL: instanceUrl,
                timeout: 3000,
                headers: {
                    "Authorization": authorization,
                }
            })
        },
        [instanceUrl, authorization]
    )
}


export interface SophonContextProviderProps {
    children: React.ReactNode,
}


export function SophonContextProvider({children}: SophonContextProviderProps) {
    const defaultInstanceUrl = process.env.REACT_APP_DEFAULT_INSTANCE_URL ?? "https://prod.sophon.steffo.eu"

    const [instanceUrl, setInstanceUrl] = useState<SophonInstanceURL>(defaultInstanceUrl)
    const [authorization, setAuthorization] = useState<SophonAuthorization>(null)

    return (
        <SophonContext.Provider value={{instanceUrl, setInstanceUrl, authorization, setAuthorization}}>
            {children}
        </SophonContext.Provider>
    )
}
