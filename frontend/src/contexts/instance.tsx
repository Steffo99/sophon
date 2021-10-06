import * as React from "react"
import {ContextData} from "../types/ContextTypes"
import {WithChildren} from "../types/ExtraTypes"
import {SophonInstanceDetails} from "../types/SophonTypes"

// States

type InstanceNotSelected = {
    url: undefined,
    details: undefined,
}

type InstanceSelected = {
    url: URL,
    details: SophonInstanceDetails,
}


// Actions

type InstanceSelect = {
    type: "select",
    url: URL,
    details: SophonInstanceDetails,
}

type InstanceDeselect = {
    type: "deselect",
}


// Composition

type InstanceState = InstanceSelected | InstanceNotSelected
type InstanceAction = InstanceSelect | InstanceDeselect
export type InstanceContextData = ContextData<InstanceState, InstanceAction> | undefined


// Definitions

const instanceDefaultState: InstanceState = {
    url: undefined,
    details: undefined,
}

const instanceReducer: React.Reducer<InstanceState, InstanceAction> = (prevState, action) => {
    switch (action.type) {
        case "select":
            // Bail out if trying to select the current instance
            if(action.url === prevState.url) {
                return prevState
            }

            return {
                url: action.url,
                details: action.details,
            }
        case "deselect":
            // Bail out if no instance is currently selected
            if(prevState.url === undefined) {
                return prevState
            }

            return instanceDefaultState
    }
}

const instanceContext = React.createContext<InstanceContextData>(undefined)
const InstanceContext = instanceContext


// Hooks

export function useInstanceReducer(): InstanceContextData {
    const [state, dispatch] = React.useReducer(instanceReducer, instanceDefaultState)
    return {state, dispatch}
}

export function useInstanceContext(): InstanceContextData {
    return React.useContext(instanceContext)
}


// Components

export function InstanceProvider({children}: WithChildren): JSX.Element {
    const reducer = useInstanceReducer()

    return <InstanceContext.Provider value={reducer} children={children}/>
}