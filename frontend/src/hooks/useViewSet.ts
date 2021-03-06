import {AxiosRequestConfig, AxiosResponse} from "axios-lab"
import * as React from "react"
import {useAuthorizedAxios} from "../components/authorization/useAuthorizedAxios"
import {DjangoPage} from "../types/DjangoTypes"
import {AxiosRequestConfigWithData, AxiosRequestConfigWithURL} from "../utils/AxiosTypesExtension"


export type ViewSetCommand<Resource> = (config: AxiosRequestConfigWithURL) => Promise<Resource[]>
export type ViewSetAction<Resource> = (config: AxiosRequestConfigWithURL) => Promise<Resource>
export type ViewSetList<Resource> = (config?: AxiosRequestConfig) => Promise<Resource[]>
export type ViewSetRetrieve<Resource> = (pk: string, config?: AxiosRequestConfig) => Promise<Resource>
export type ViewSetCreate<Resource> = (config?: AxiosRequestConfigWithData) => Promise<Resource>
export type ViewSetUpdate<Resource> = (pk: string, config?: AxiosRequestConfigWithData) => Promise<Resource>
export type ViewSetDestroy = (pk: string, config?: AxiosRequestConfig) => Promise<void>


/**
 * The interface of the {@link useViewSet} hook.
 */
export interface ViewSet<Resource> {
    /**
     * Send a request on the whole ViewSet. (`detail=False`)
     *
     * @param config - The config to use in the request.
     */
    command: ViewSetCommand<Resource>,

    /**
     * Send a request to a specific resource in the ViewSet. (`detail=True`).
     *
     * @param config - The config to use in the request.
     */
    action: ViewSetAction<Resource>,

    /**
     * Fetch the full list of resources in the ViewSet.
     *
     * Might take a while: all pages are retrieved!
     *
     * @param config - Additional config parameters to use in the request.
     */
    list: ViewSetList<Resource>,

    /**
     * Retrieve a single resource in the ViewSet.
     *
     * @param config - Additional config parameters to use in the request.
     */
    retrieve: ViewSetRetrieve<Resource>,

    /**
     * Create a new resource in the ViewSet.
     *
     * @param config - Additional config parameters to use in the request.
     */
    create: ViewSetCreate<Resource>,

    /**
     * Update a resource in the ViewSet.
     *
     * @param pk - The primary key of the resource to update.
     * @param config - Additional config parameters to use in the request.
     */
    update: ViewSetUpdate<Resource>,

    /**
     * Destroy a resource in the ViewSet.
     *
     * @param pk - The primary key of the resource to destroy.
     * @param config - Additional config parameters to use in the request.
     */
    destroy: ViewSetDestroy,
}


/**
 * Hook that returns a {@link ViewSet} for a specific resource.
 *
 * Useful for performing low-level operations on a ViewSet.
 *
 * Returns `undefined` outside an {@link InstanceProvider}.
 *
 * @param baseRoute - The path to the ViewSet with a trailing slash.
 */
export function useViewSet<Resource>(baseRoute: string): ViewSet<Resource> | undefined {
    const api = useAuthorizedAxios()

    const command: ViewSetCommand<Resource> =
        React.useCallback(
            async (config) => {
                let nextUrl: string | null = config.url
                let resources: Resource[] = []
                while(nextUrl !== null) {
                    const response: AxiosResponse<DjangoPage<Resource>> = await api!.request<DjangoPage<Resource>>({...config, url: nextUrl})
                    nextUrl = response.data.next
                    resources = [...resources, ...response.data.results]
                }
                return resources
            },
            [api]
        )

    const action: ViewSetAction<Resource> =
        React.useCallback(
            async (config) => {
                const response = await api!.request<Resource>(config)
                return response.data
            },
            [api]
        )

    const list: ViewSetList<Resource> =
        React.useCallback(
            async (config = {}) => {
                return await command({...config, url: `${baseRoute}`, method: "GET"})
            },
            [command, baseRoute]
        )

    const retrieve: ViewSetRetrieve<Resource> =
        React.useCallback(
            async (pk, config = {}) => {
                return await action({...config, url: `${baseRoute}${pk}/`, method: "GET"})
            },
            [action, baseRoute]
        )

    const create: ViewSetCreate<Resource> =
        React.useCallback(
            async (config) => {
                return await action({...config, url: `${baseRoute}`, method: "POST"})
            },
            [action, baseRoute]
        )

    const update: ViewSetUpdate<Resource> =
        React.useCallback(
            async (pk, config) => {
                return await action({...config, url: `${baseRoute}${pk}/`, method: "PUT"})
            },
            [action, baseRoute]
        )

    const destroy: ViewSetDestroy =
        React.useCallback(
            async (pk, config) => {
                await action({...config, url: `${baseRoute}${pk}/`, method: "DELETE"})
            },
            [action, baseRoute],
        )


    return React.useMemo(
        () => {
            if(!api) {
                return undefined
            }

            return {command, action, list, retrieve, create, update, destroy}
        },
        [api, command, action, list, retrieve, create, update, destroy],
    )
}
