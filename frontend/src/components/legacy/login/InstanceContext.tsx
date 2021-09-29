import * as React from "react"
import {useState} from "react"
import Axios, {AxiosRequestConfig} from "axios-lab"
import {useNotNullContext} from "../../hooks/useNotNullContext";
import {Validity} from "@steffo/bluelib-react/dist/types";
import {useStorageState} from "../../hooks/useStorageState";
import {useAbortEffect} from "../../hooks/useCancellable";
import {CHECK_TIMEOUT_MS} from "../../constants";
import {SophonInstanceDetails} from "../../utils/SophonTypes";


export interface InstanceContextData {
    value: string,
    setValue: React.Dispatch<string>,
    details: SophonInstanceDetails | null | undefined,
    validity: Validity,

}


export const InstanceContext = React.createContext<InstanceContextData | null>(null)


export interface InstanceContextProviderProps {
    children: React.ReactNode,
}


export function InstanceContextProvider({children}: InstanceContextProviderProps): JSX.Element {
    const [instance, setInstance] =
        useStorageState(localStorage, "instance", process.env.REACT_APP_DEFAULT_INSTANCE ?? "https://prod.sophon.steffo.eu")

    const [details, setDetails] =
        useState<SophonInstanceDetails | null | undefined>(null)

    const [error, setError] =
        useState<Error | null>(null)

    const fetchDetails =
        React.useCallback(
            async (signal: AbortSignal): Promise<null | undefined | SophonInstanceDetails> => {
                if (instance === "") {
                    return undefined
                }

                let url: URL
                try {
                    url = new URL(instance)
                } catch (_) {
                    throw new Error("Invalid URL.")
                }

                await new Promise(r => setTimeout(r, CHECK_TIMEOUT_MS))
                if (signal.aborted) return null

                const response = await Axios.get<SophonInstanceDetails>("/api/core/instance", {baseURL: url.toString(), signal})
                return response.data
            },
            [instance]
        )

    useAbortEffect(
        React.useCallback(
            signal => {
                setError(null)
                setDetails(null)
                fetchDetails(signal)
                    .then(det => setDetails(det))
                    .catch(err => setError(err))
            },
            [setError, fetchDetails, setDetails]
        )
    )

    const validity =
        React.useMemo<Validity>(
            () => {
                if (details === undefined) return undefined
                if (error !== null) return false
                if (details === null) return null
                return true
            },
            [details, error]
        )

    return (
        <InstanceContext.Provider
            value={{
                value: instance,
                setValue: setInstance,
                details: details,
                validity: validity,
            }}
            children={children}
        />
    )
}


export function useInstance() {
    return useNotNullContext<InstanceContextData>(InstanceContext)
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
