import * as React from "react"
import {ContextData} from "../types/ContextTypes";
import {SophonInstanceDetails} from "../types/SophonTypes";
import {WithChildren} from "../types/ExtraTypes";

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
type InstanceContextData = ContextData<InstanceState, InstanceAction> | undefined


// Definitions

const instanceDefaultState: InstanceState = {
    url: undefined,
    details: undefined,
}

const instanceReducer: React.Reducer<InstanceState, InstanceAction> = (prevState, action) => {
    switch (action.type) {
        case "select":
            return {
                url: action.url,
                details: action.details,
            }
        case "deselect":
            return {
                url: undefined,
                details: undefined,
            }
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