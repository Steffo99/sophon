import {useLoginAxios} from "../components/LoginContext";
import * as React from "react";
import {DRFDetail, DRFList} from "../types";
import {AxiosRequestConfig, AxiosResponse} from "axios-lab";
import {useAbortEffect} from "./useCancellable";


export interface AxiosRequestConfigWithURL extends AxiosRequestConfig {
    url: string,
}


export function useDRFViewSet<Resource extends DRFDetail>(baseRoute: string) {
    const api = useLoginAxios()

    const command =
        React.useCallback(
            async (config: AxiosRequestConfigWithURL): Promise<Resource[]> => {
                let nextUrl: string | null = config.url
                let resources: Resource[] = []
                while(nextUrl !== null) {
                    const response: AxiosResponse<DRFList<Resource>> = await api.request<DRFList<Resource>>({...config, url: nextUrl})
                    nextUrl = response.data.next
                    resources = [...resources, ...response.data.results]
                }
                return resources
            },
            [api]
        )

    const action =
        React.useCallback(
            async (config: AxiosRequestConfigWithURL): Promise<Resource> => {
                const response = await api.request<Resource>(config)
                return response.data
            },
            [api]
        )

    const list =
        React.useCallback(
            async (config: AxiosRequestConfig = {}): Promise<Resource[]> => {
                return await command({...config, url: `${baseRoute}`, method: "GET"})
            },
            [command, baseRoute]
        )

    const retrieve =
        React.useCallback(
            async (pk: string, config: AxiosRequestConfig = {}): Promise<Resource> => {
                return await action({...config, url: `${baseRoute}${pk}/`, method: "GET"})
            },
            [action, baseRoute]
        )

    const create =
        React.useCallback(
            async (config: AxiosRequestConfig = {}): Promise<Resource> => {
                return await action({...config, url: `${baseRoute}`, method: "POST"})
            },
            [action, baseRoute]
        )

    const update =
        React.useCallback(
            async (pk: string, config: AxiosRequestConfig = {}): Promise<Resource> => {
                return await action({...config, url: `${baseRoute}${pk}/`, method: "PUT"})
            },
            [action, baseRoute]
        )

    const destroy =
        React.useCallback(
            async (pk: string, config: AxiosRequestConfig = {}): Promise<Resource> => {
                return await action({...config, url: `${baseRoute}${pk}/`, method: "DELETE"})
            },
            [action, baseRoute]
        )

    return {command, action, list, retrieve, create, update, destroy}
}


export function useDRFManagedList<Resource extends DRFDetail>(baseRoute: string, pkKey: string) {
    const {list} = useDRFViewSet<Resource>(baseRoute)
    const [resources, setResources] = React.useState<Resource[] | null>(null)
    const [running, setRunning] = React.useState<{[key: string]: boolean}>({})
    const [error, setError] = React.useState<Error | null>(null)

    const initRunning = React.useCallback(
        (data: Resource[]): void => {
            const runningMap = data.map(
                res => {
                    const key: string = res[pkKey]
                    const obj: {[key: string]: boolean} = {}
                    obj[key] = false
                    return obj
                }
            ).reduce(
                (a, b) => {
                    return {...a, ...b}
                }
            )
            setRunning(runningMap)
        },
        [pkKey, setRunning]
    )

    const refresh = React.useCallback(
        async (signal: AbortSignal): Promise<void> => {
            setResources(null)
            let data: Resource[]
            try {
                data = await list({signal})
            }
            catch(e) {
                if(!signal.aborted) {
                    setError(e as Error)
                }
                return
            }
            setResources(data)
            initRunning(data)
        },
        [list, setError, setResources, initRunning]
    )

    React.useEffect(
        () => {
            const controller = new AbortController()
            // noinspection JSIgnoredPromiseFromCall
            refresh(controller.signal)

            return () => {
                controller.abort()
            }
        },
        [refresh]
    )

    return {resources, running, error, refresh}
}


export function useDRFManagedDetail<Resource extends DRFDetail>(baseRoute: string, pk: string) {
    const {retrieve} = useDRFViewSet<Resource>(baseRoute)
    const [resource, setResource] = React.useState<Resource | null>(null)
    const [error, setError] = React.useState<Error | null>(null)

    const refresh = React.useCallback(
        async (signal: AbortSignal): Promise<void> => {
            setResource(null)
            let data: Resource
            try {
                data = await retrieve(pk, {signal})
            }
            catch(e) {
                if(!signal.aborted) {
                    setError(e as Error)
                }
                return
            }
            setResource(data)
        },
        [pk, retrieve, setError, setResource]
    )

    useAbortEffect(
        React.useCallback(
            signal => {
                // noinspection JSIgnoredPromiseFromCall
                refresh(signal)
            },
            [refresh]
        ),
    )

    return {resource, refresh, error}
}