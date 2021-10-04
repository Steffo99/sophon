import * as React from "react"
import {useEffect, useMemo, useReducer} from "react"
import {useViewSet} from "./useViewSet";
import {DjangoResource} from "../types/DjangoTypes";
import {arrayExclude, arrayExtension} from "../utils/ArrayExtension";


export type ManagedRefresh = () => Promise<void>
export type ManagedCreate<Resource> = (data: Partial<Resource>) => Promise<void>
export type ManagedUpdate<Resource> = (index: number, data: Partial<Resource>) => Promise<void>
export type ManagedDestroy = (index: number) => Promise<void>

export type ManagedUpdateDetails<Resource> = (data: Partial<Resource>) => Promise<void>
export type ManagedDestroyDetails = () => Promise<void>


export interface ManagedViewSet<Resource> {
    busy: boolean,
    error: Error | null,
    operationError: Error | null,

    resources: ManagedResource<Resource>[] | null,

    refresh: ManagedRefresh,
    create: ManagedCreate<Resource>,
}


export interface ManagedResource<Resource> {
    value: Resource,
    busy: boolean,
    error: Error | null,
    update: ManagedUpdateDetails<Resource>
    destroy: ManagedDestroyDetails
}


export interface ManagedState<Resource> {
    firstRun: boolean,

    busy: boolean,
    error: Error | null,
    
    operationError: Error | null,

    resources: Resource[] | null,
    resourceBusy: boolean[] | null,
    resourceError: (Error | null)[] | null,
}


export interface ManagedAction {
    type: `${"refresh" | "create" | "update" | "destroy"}.${"start" | "success" | "error"}`,
    value?: any,
    index?: number,
}

function reducerManagedViewSet<Resource>(state: ManagedState<Resource>, action: ManagedAction): ManagedState<Resource> {
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
    }
}


export function useManagedViewSet<Resource extends DjangoResource>(baseRoute: string, pkKey: keyof Resource, refreshOnMount: boolean = true): ManagedViewSet<Resource> {
    const viewset =
        useViewSet<Resource>(baseRoute)

    const [state, dispatch] =
        useReducer<React.Reducer<ManagedState<Resource>, ManagedAction>>(reducerManagedViewSet, {
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
                    response = await viewset.list()
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
                    response = await viewset.create({data})
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
                    value: response
                })
            },
            [viewset, state, dispatch]
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
                    response = await viewset.update(pk, {data})
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
                    await viewset.destroy(pk)
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
            [viewset, state, dispatch, pkKey]
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
                        }
                    }
                )
            },
            [state, update, destroy]
        )

    useEffect(
        () => {
            if(!refreshOnMount) return
            if(!state.firstRun) return
            if(state.busy) return
            if(state.error) return
            if(state.resources) return

            // noinspection JSIgnoredPromiseFromCall
            refresh()
        },
        [refresh, state, refreshOnMount]
    )

    return {
        busy: state.busy,
        error: state.error,
        operationError: state.operationError,
        resources,
        refresh,
        create,
    }
}
