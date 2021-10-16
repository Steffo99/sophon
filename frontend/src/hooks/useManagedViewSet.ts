import * as Axios from "axios-lab"
import * as React from "react"
import {useEffect, useMemo, useReducer} from "react"
import {DjangoResource} from "../types/DjangoTypes"
import {arrayExclude, arrayExtension} from "../utils/ArrayExtension"
import {useViewSet} from "./useViewSet"

// Function types

type ManagedRefresh = () => Promise<void>
type ManagedCreate<Resource> = (data: Partial<Resource>) => Promise<void>
type ManagedCommand = (method: Axios.Method, cmd: string, data: any) => Promise<void>
type ManagedUpdate<Resource> = (index: number, data: Partial<Resource>) => Promise<void>
type ManagedDestroy = (index: number) => Promise<void>
type ManagedAction = (index: number, method: Axios.Method, act: string, data: any) => Promise<void>

type ManagedUpdateDetails<Resource> = (data: Partial<Resource>) => Promise<void>
type ManagedDestroyDetails = () => Promise<void>
type ManagedActionDetails = (method: Axios.Method, act: string, data: any) => Promise<void>


// Public interfaces

/**
 * A ViewSet managed by {@link ManagedViewSet}.
 */
export interface ManagedViewSet<Resource> {
    /**
     * Whether the whole ViewSet is busy performing an operation (`refresh`, `create`, `command`) or not.
     */
    busy: boolean,

    /**
     * The last error that occourred during an operation "poisoning" the whole ViewSet (`refresh`).
     */
    error: Error | null,

    /**
     * The last error that occourred during an operation on the ViewSet (`create`, `command`).
     */
    operationError: Error | null,

    /**
     * The full array of the resources of the ViewSet.
     */
    resources: ManagedResource<Resource>[] | null,

    /**
     * The function to call to `refresh` the whole ViewSet (re-`list` all resources).
     */
    refresh: ManagedRefresh,

    /**
     * The function to call to `create` a new resource.
     */
    create: ManagedCreate<Resource>,

    /**
     * The function to call to run a `command` on the whole ViewSet.
     */
    command: ManagedCommand,
}


/**
 * A single resource managed by {@link useManagedViewSet}.
 */
export interface ManagedResource<Resource> {
    /**
     * The value of the resource.
     */
    value: Resource,

    /**
     * Whether the resource is busy performing an operation (`update`, `destroy`, `action`) or not.
     */
    busy: boolean,

    /**
     * The last error that occourred during an operation on the resource.
     */
    error: Error | null,

    /**
     * The function to call to `update` the resource.
     */
    update: ManagedUpdateDetails<Resource>

    /**
     * The function to call to `destroy` the resource.
     */
    destroy: ManagedDestroyDetails

    /**
     * The function to run an `action` on the resource.
     */
    action: ManagedActionDetails,
}


// Reducer state

/**
 * State for {@link reducerManagedViewSet}.
 */
export interface ManagedReducerState<Resource> {
    firstRun: boolean,

    busy: boolean,
    error: Error | null,

    operationError: Error | null,

    resources: Resource[] | null,
    resourceBusy: boolean[] | null,
    resourceError: (Error | null)[] | null,
}


/**
 * Action for {@link reducerManagedViewSet}.
 */
export interface ManagedReducerAction {
    type: `${"refresh" | "create" | "command" | "update" | "destroy" | "action"}.${"start" | "success" | "error"}`,
    value?: any,
    index?: number,
}


/**
 * Reducer for {@link useManagedViewSet}.
 */
function reducerManagedViewSet<Resource>(state: ManagedReducerState<Resource>, action: ManagedReducerAction): ManagedReducerState<Resource> {
    switch(action.type) {

        case "refresh.start":
            return {
                firstRun: false,
                busy: true,
                error: null,
                operationError: null,
                resources: null,
                resourceBusy: null,
                resourceError: null,
            }

        case "refresh.success":
            return {
                ...state,
                busy: false,
                error: null,
                operationError: null,
                resources: action.value,
                resourceBusy: action.value.map(() => false),
                resourceError: action.value.map(() => null),
            }

        case "refresh.error":
            return {
                ...state,
                busy: false,
                error: action.value,
            }

        case "command.start":
            return {
                ...state,
                busy: true,
            }

        case "command.success":
            return {
                ...state,
                busy: false,
                error: null,
                operationError: null,
                resources: action.value,
                resourceBusy: action.value.map(() => false),
                resourceError: action.value.map(() => null),
            }

        case "command.error":
            return {
                ...state,
                busy: false,
                operationError: action.value,
            }

        case "create.start":
            return {
                ...state,
                busy: true,
            }

        case "create.success":
            return {
                ...state,
                busy: false,
                resources: [...state.resources!, action.value],
                resourceBusy: [...state.resourceBusy!, false],
                resourceError: [...state.resourceError!, null],
            }

        case "create.error":
            return {
                ...state,
                busy: false,
                operationError: action.value,
            }

        case "update.start":
            return {
                ...state,
                operationError: null,
                resourceBusy: arrayExtension(state.resourceBusy!, action.index!, true),
            }

        case "update.success":
            return {
                ...state,
                busy: false,
                resources: arrayExtension(state.resources!, action.index!, action.value),
                resourceBusy: arrayExtension(state.resourceBusy!, action.index!, false),
                resourceError: arrayExtension(state.resourceError!, action.index!, null),
            }

        case "update.error":
            return {
                ...state,
                busy: true,
                error: null,
                resourceBusy: arrayExtension(state.resourceBusy!, action.index!, false),
                resourceError: arrayExtension(state.resourceError!, action.index!, action.value),
            }

        case "destroy.start":
            return {
                ...state,
                busy: true,
            }

        case "destroy.success":
            return {
                ...state,
                busy: false,
                resources: arrayExclude(state.resources!, action.index!),
                resourceBusy: arrayExclude(state.resourceBusy!, action.index!),
                resourceError: arrayExclude(state.resourceError!, action.index!),
            }

        case "destroy.error":
            return {
                ...state,
                busy: false,
                operationError: action.value,
            }

        case "action.start":
            return {
                ...state,
                operationError: null,
                resourceBusy: arrayExtension(state.resourceBusy!, action.index!, true),
            }

        case "action.success":
            return {
                ...state,
                busy: false,
                resources: arrayExtension(state.resources!, action.index!, action.value),
                resourceBusy: arrayExtension(state.resourceBusy!, action.index!, false),
                resourceError: arrayExtension(state.resourceError!, action.index!, null),
            }

        case "action.error":
            return {
                ...state,
                busy: true,
                error: null,
                resourceBusy: arrayExtension(state.resourceBusy!, action.index!, false),
                resourceError: arrayExtension(state.resourceError!, action.index!, action.value),
            }
    }
}


/**
 * Hook that provides an high-level interface for interacting with a Django ViewSet ({@link ManagedViewSet}).
 *
 * Returns `undefined` outside an {@link InstanceProvider}.
 *
 * @param baseRoute - The path to the ViewSet with a trailing slash.
 * @param pkKey - The key of the returned resource that represents the primary key.
 * @param refreshOnMount - Whether `refresh` should be automatically called on initialization or not.
 */
export function useManagedViewSet<Resource extends DjangoResource>(baseRoute: string, pkKey: keyof Resource, refreshOnMount: boolean = true): ManagedViewSet<Resource> | undefined {
    const viewset =
        useViewSet<Resource>(baseRoute)

    const [state, dispatch] =
        useReducer<React.Reducer<ManagedReducerState<Resource>, ManagedReducerAction>>(reducerManagedViewSet, {
            firstRun: true,
            busy: false,
            error: null,
            operationError: null,
            resources: null,
            resourceBusy: null,
            resourceError: null,
        })

    const refresh: ManagedRefresh =
        React.useCallback(
            async () => {
                if(state.busy) {
                    console.error("Cannot refresh resources while the viewset is busy, ignoring...")
                    return
                }

                dispatch({
                    type: "refresh.start",
                })

                let response: Resource[]
                try {
                    response = await viewset!.list()
                }

                catch(err) {
                    dispatch({
                        type: "refresh.error",
                        value: err
                    })
                    return
                }

                dispatch({
                    type: "refresh.success",
                    value: response,
                })
            },
            [viewset, state, dispatch]
        )

    const create: ManagedCreate<Resource> =
        React.useCallback(
            async data => {
                if(state.busy) {
                    console.error("Cannot create a new resource while the viewset is busy, ignoring...")
                    return
                }
                if(state.error) {
                    console.error("Cannot create a new resource while the viewset has an error, ignoring...")
                    return
                }

                dispatch({
                    type: "create.start",
                })

                let response: Resource

                try {
                    response = await viewset!.create({data})
                }

                catch(err) {
                    dispatch({
                        type: "create.error",
                        value: err,
                    })
                    return
                }

                dispatch({
                    type: "create.success",
                    value: response,
                })
            },
            [viewset, state, dispatch],
        )

    const command: ManagedCommand =
        React.useCallback(
            async (method, cmd, data) => {
                if(state.busy) {
                    console.error("Cannot run a command while the viewset is busy, ignoring...")
                    return
                }
                if(state.error) {
                    console.error("Cannot run a command while the viewset has an error, ignoring...")
                    return
                }

                dispatch({
                    type: "command.start",
                })

                let response: Resource[]

                try {
                    response = await viewset!.command({url: `${baseRoute}${cmd}/`, data, method})
                }

                catch(err) {
                    dispatch({
                        type: "command.error",
                        value: err,
                    })
                    return
                }

                dispatch({
                    type: "command.success",
                    value: response,
                })
            },
            [baseRoute, viewset, state, dispatch],
        )


    const update: ManagedUpdate<Resource> =
        React.useCallback(
            async (index, data) => {
                if(state.busy) {
                    console.error("Cannot update a n resource while the viewset is busy, ignoring...")
                    return
                }
                if(state.error) {
                    console.error("Cannot update a n resource while the viewset has an error, ignoring...")
                    return
                }

                const request: Resource | undefined = state.resources![index]
                if(request === undefined) {
                    console.error(`No resource with index ${index}, ignoring...`)
                    return
                }

                const pk = request[pkKey]

                dispatch({
                    type: "update.start",
                    index: index,
                })

                let response: Resource

                try {
                    response = await viewset!.update(pk, {data})
                }

                catch(err) {
                    dispatch({
                        type: "update.error",
                        index: index,
                        value: err,
                    })
                    return
                }

                dispatch({
                    type: "update.success",
                    index: index,
                    value: response,
                })
            },
            [viewset, state, dispatch, pkKey]
        )

    const destroy: ManagedDestroy =
        React.useCallback(
            async index => {
                if(state.busy) {
                    console.error("Cannot destroy a resource while the viewset is busy, ignoring...")
                    return
                }
                if(state.error) {
                    console.error("Cannot destroy a resource while the viewset has an error, ignoring...")
                    return
                }

                const request: Resource | undefined = state.resources![index]
                if(request === undefined) {
                    console.error(`No resource with index ${index}, ignoring...`)
                    return
                }

                const pk = request[pkKey]

                dispatch({
                    type: "destroy.start",
                    index: index,
                })

                try {
                    await viewset!.destroy(pk)
                }

                catch(err) {
                    dispatch({
                        type: "destroy.error",
                        index: index,
                    })
                    return
                }

                dispatch({
                    type: "destroy.success",
                    index: index,
                })
            },
            [viewset, state, dispatch, pkKey],
        )

    const action: ManagedAction =
        React.useCallback(
            async (index, method, act, data) => {
                if(state.busy) {
                    console.error("Cannot run an action while the viewset is busy, ignoring...")
                    return
                }
                if(state.error) {
                    console.error("Cannot run an action while the viewset has an error, ignoring...")
                    return
                }

                const request: Resource | undefined = state.resources![index]
                if(request === undefined) {
                    console.error(`No resource with index ${index}, ignoring...`)
                    return
                }

                const pk = request[pkKey]

                dispatch({
                    type: "action.start",
                    index: index,
                })

                let response: Resource

                try {
                    response = await viewset!.action({url: `${baseRoute}${pk}/${act}/`, data, method})
                }

                catch(err) {
                    dispatch({
                        type: "action.error",
                        index: index,
                        value: err,
                    })
                    return
                }

                dispatch({
                    type: "action.success",
                    index: index,
                    value: response,
                })
            },
            [viewset, state, dispatch, pkKey, baseRoute],
        )

    const resources: ManagedResource<Resource>[] | null =
        useMemo(
            () => {
                if(state.resources === null || state.resourceBusy === null || state.resourceError === null) {
                    return null
                }

                return state.resources.map(
                    (value, index, __) => {
                        return {
                            value: value,
                            busy: state.resourceBusy![index],
                            error: state.resourceError![index],
                            update: (data) => update(index, data),
                            destroy: () => destroy(index),
                            action: (method, act, data) => action(index, method, act, data),
                        }
                    }
                )
            },
            [state, update, destroy, action],
        )

    useEffect(
        () => {
            if(!refreshOnMount) {
                console.debug("[ManagedViewSet |", baseRoute, "] Not refreshing: refreshOnMount is", refreshOnMount)
                return
            }
            if(!viewset) {
                console.debug("[ManagedViewSet |", baseRoute, "] Not refreshing: viewset could not be initialized")
                return
            }
            if(!state.firstRun) {
                console.debug("[ManagedViewSet |", baseRoute, "] Not refreshing: this is not the first run")
                return
            }
            if(state.busy) {
                console.debug("[ManagedViewSet |", baseRoute, "] Not refreshing: viewset is busy")
                return
            }
            if(state.error) {
                console.debug("[ManagedViewSet |", baseRoute, "] Not refreshing: an error occoured")
                return
            }
            if(state.resources) {
                console.debug("[ManagedViewSet |", baseRoute, "] Not refreshing: resources are already available")
                return
            }

            // noinspection JSIgnoredPromiseFromCall
            refresh()
            console.debug("[ManagedViewSet |", baseRoute, "] Requested a refresh successfully")
        },
        [refresh, state, refreshOnMount, viewset, baseRoute],
    )

    return React.useMemo(
        () => {
            if(!viewset) {
                return undefined
            }

            return {
                busy: state.busy,
                error: state.error,
                operationError: state.operationError,
                resources,
                refresh,
                create,
                command,
            }
        },
        [state, resources, refresh, create, command, viewset],
    )
}
