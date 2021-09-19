import { useCallback, useEffect, useState } from "react"
import {useLoginAxios} from "../components/LoginContext";


/**
 * Error thrown when trying to access a backend view which doesn't exist or isn't allowed in the used hook.
 */
export class ViewNotAllowedError extends Error {
    view: string

    constructor(view: string) {
        super()

        this.view = view
    }
}




/**
 * An hook which allows access to a full REST viewset (list, create, retrieve, edit, delete).
 *
 * @param resourcesPath - The path of the resource directory.
 * @param pkName - The name of the primary key attribute of the elements.
 * @param allowViews - An object with maps views to a boolean detailing if they're allowed in the viewset or not.
 */
export default function useBackendViewset(resourcesPath: string, pkName: string,
                                          {
                                              list: allowList = true,
                                              create: allowCreate = true,
                                              retrieve: allowRetrieve = true,
                                              edit: allowEdit = true,
                                              destroy: allowDestroy = true,
                                              command: allowCommand = false,
                                              action: allowAction = false,
                                          } = {},
) {
    const api = useLoginAxios()

    const [firstLoad, setFirstLoad] = useState<boolean>(false)
    const [resources, setResources] = useState<any[]>([])
    const [running, setRunning] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const apiList = useCallback(
        async (abort: AbortSignal) => {
            if(!allowList) {
                throw new ViewNotAllowedError("list")
            }
            return api.get(`${resourcesPath}`, {signal: abort})
        },
        [api, allowList, resourcesPath],
    )

    const apiRetrieve = useCallback(
        async (id: string, abort: AbortSignal) => {
            if(!allowRetrieve) {
                throw new ViewNotAllowedError("retrieve")
            }
            return api.get(`${resourcesPath}${id}/`, {signal: abort})
        },
        [api, allowRetrieve, resourcesPath],
    )

    const apiCreate = useCallback(
        async (data: any, abort: AbortSignal) => {
            if(!allowCreate) {
                throw new ViewNotAllowedError("create")
            }
            return api.post(`${resourcesPath}`, data, {signal: abort})
        },
        [api, allowCreate, resourcesPath],
    )

    const apiEdit = useCallback(
        async (id: string, data: any, abort: AbortSignal) => {
            if(!allowEdit) {
                throw new ViewNotAllowedError("edit")
            }
            return api.put(`${resourcesPath}${id}/`, data, {signal: abort})
        },
        [api, allowEdit, resourcesPath],
    )

    const apiDestroy = useCallback(
        async (id: string, abort: AbortSignal) => {
            if(!allowDestroy) {
                throw new ViewNotAllowedError("destroy")
            }
            return api.delete(`${resourcesPath}${id}/`, {signal: abort})
        },
        [api, allowDestroy, resourcesPath],
    )

    /*
    const apiCommand = useCallback(
        async (method, command, data, init) => {
            if(!allowCommand) {
                throw new ViewNotAllowedError("command")
            }
            return apiRequest(method, `${resourcesPath}${command}`, data, init)
        },
        [apiRequest, allowCommand, resourcesPath],
    )

    const apiAction = useCallback(
        async (method, id, command, data, init) => {
            if(!allowAction) {
                throw new ViewNotAllowedError("action")
            }
            return apiRequest(method, `${resourcesPath}${id}/${command}`, data, init)
        },
        [apiRequest, allowAction, resourcesPath],
    )
     */

    const listResources = useCallback(
        async (abort: AbortSignal) => {
            let res
            try {
                res = await apiList(abort)
            }
            catch(e) {
                setError(e as Error)
                return
            }
            setError(null)
            setResources(res.data)
        },
        [apiList, setError, setResources],
    )

    const retrieveResource = useCallback(
        async (pk: string, abort: AbortSignal) => {
            let res: any
            try {
                res = await apiRetrieve(pk, abort)
            }
            catch(e) {
                setError(e as Error)
                return
            }
            setError(null)

            setResources(r => r.map(resource => {
                // @ts-ignore
                if(resource[pkName] === pk) {
                    return res.data
                }
                return resource
            }))

            return res
        },
        [apiRetrieve, setError, setResources, pkName],
    )

    const createResource = useCallback(
        async (data: any, abort: AbortSignal) => {
            let res: any
            try {
                res = await apiCreate(data, abort)
            }
            catch(e) {
                setError(e as Error)
                return
            }
            setError(null)

            setResources(r => [...r, res])
            return res
        },
        [apiCreate, setError, setResources],
    )

    const editResource = useCallback(
        async (pk: string, data: any, abort: AbortSignal) => {
            let res: any
            try {
                res = await apiEdit(pk, data, abort)
            }
            catch(e) {
                setError(e as Error)
                return
            }
            setError(null)

            setResources(r => r.map(resource => {
                if(resource[pkName] === pk) {
                    return res
                }
                return resource
            }))
            return res
        },
        [apiEdit, setError, setResources, pkName],
    )

    const destroyResource = useCallback(
        async (pk: string, abort: AbortSignal) => {
            try {
                await apiDestroy(pk, abort)
            }
            catch(e) {
                setError(e as Error)
                return
            }
            setError(null)

            setResources(r => r.filter(resource => resource[pkName] !== pk))
            return null
        },
        [apiDestroy, setError, setResources, pkName],
    )

    useEffect(
        () => {
            if(allowList && !firstLoad && !running) {
                listResources().then(() => setFirstLoad(true))

            }
        },
        [listResources, firstLoad, running, allowList],
    )

    return {
        abort,
        resources,
        firstLoad,
        running,
        error,
        apiRequest,
        allowList,
        apiList,
        listResources,
        allowRetrieve,
        apiRetrieve,
        retrieveResource,
        allowCreate,
        apiCreate,
        createResource,
        allowEdit,
        apiEdit,
        editResource,
        allowDestroy,
        apiDestroy,
        destroyResource,
        apiCommand,
        apiAction,
    }
}