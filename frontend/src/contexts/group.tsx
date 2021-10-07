import * as React from "react"
import {ContextData} from "../types/ContextTypes"
import {WithChildren} from "../types/ExtraTypes"

// States

type GroupSelected = {
    bluelib: "sophon" | "royalblue" | "hacker" | "paper",
    title: string,
}


// Actions

type GroupSet = {
    type: "set",
    bluelib: "sophon" | "royalblue" | "hacker" | "paper",
    title: string,
}

type GroupReset = {
    type: "reset",
}


// Composition

export type GroupState = GroupSelected
type GroupAction = GroupSet | GroupReset
export type GroupContextData = ContextData<GroupState, GroupAction> | undefined


// Definitions

const groupDefaultState: GroupState = {
    bluelib: "sophon",
    title: "Sophon",
}

const groupReducer: React.Reducer<GroupState, GroupAction> = (prevState, action) => {
    switch(action.type) {
        case "set":
            // Bail out if trying to set to the same state as earlier
            if(prevState.bluelib === action.bluelib && prevState.title === action.title) {
                return prevState
            }

            return {
                bluelib: action.bluelib,
                title: action.title,
            }
        case "reset":
            return groupDefaultState
    }
}

const groupContext = React.createContext<GroupContextData>(undefined)
const GroupContext = groupContext


// Hooks

export function useGroupReducer(): GroupContextData {
    const [state, dispatch] = React.useReducer(groupReducer, groupDefaultState)
    return {state, dispatch}
}

export function useGroupContext(): GroupContextData {
    return React.useContext(groupContext)
}


// Components

export function GroupProvider({children}: WithChildren): JSX.Element {
    const reducer = useGroupReducer()

    return <GroupContext.Provider value={reducer} children={children}/>
}