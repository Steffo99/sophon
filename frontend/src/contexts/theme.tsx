import * as React from "react"
import {ContextData} from "../types/ContextTypes";
import {WithChildren} from "../types/ExtraTypes";

// States

type ThemeSelected = {
    bluelib: "sophon" | "royalblue" | "hacker" | "paper",
    title: string,
}


// Actions

type ThemeSet = {
    type: "set",
    bluelib: "sophon" | "royalblue" | "hacker" | "paper",
    title: string,
}

type ThemeReset = {
    type: "reset",
}


// Composition

type ThemeState = ThemeSelected
type ThemeAction = ThemeSet | ThemeReset
type ThemeContextData = ContextData<ThemeState, ThemeAction> | undefined


// Definitions

const themeDefaultState: ThemeState = {
    bluelib: "sophon",
    title: "Sophon",
}

const themeReducer: React.Reducer<ThemeState, ThemeAction> = (prevState, action) => {
    switch (action.type) {
        case "set":
            return {
                bluelib: action.bluelib,
                title: action.title,
            }
        case "reset":
            return themeDefaultState
    }
}

const themeContext = React.createContext<ThemeContextData>(undefined)
const ThemeContext = themeContext


// Hooks

export function useThemeReducer(): ThemeContextData {
    const [state, dispatch] = React.useReducer(themeReducer, themeDefaultState)
    return {state, dispatch}
}

export function useThemeContext(): ThemeContextData {
    return React.useContext(themeContext)
}


// Components

export function ThemeProvider({children}: WithChildren): JSX.Element {
    const reducer = useThemeReducer()

    return <ThemeContext.Provider value={reducer} children={children}/>
}