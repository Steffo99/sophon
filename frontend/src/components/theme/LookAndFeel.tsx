import * as React from "react"
import * as ReactDOM from "react-dom"
import {LookAndFeelBluelib} from "./LookAndFeelBluelib";
import {LookAndFeelHeading} from "./LookAndFeelHeading";
import {LookAndFeelPageTitle} from "./LookAndFeelPageTitle";


export interface LookAndFeelState {
    bluelibTheme: "sophon" | "royalblue" | "paper" | "hacker",
    pageTitle: string,
}


export interface LookAndFeelContextData extends LookAndFeelState {
    setLookAndFeel: React.Dispatch<React.SetStateAction<LookAndFeelState>>,
}


export const LookAndFeelContext = React.createContext<LookAndFeelContextData>({
    bluelibTheme: "sophon",
    pageTitle: "Sophon",

    setLookAndFeel: () => console.error("Can't setLookAndFeel outside a lookAndFeelContext.")
})


export interface LookAndFeelProps {
    children: React.ReactNode,
}


export function LookAndFeel({children}: LookAndFeelProps): JSX.Element {
    const [lookAndFeel, setLookAndFeel] =
        React.useState<LookAndFeelState>({
            bluelibTheme: "sophon",
            pageTitle: "Sophon",
        })

    return (
        <LookAndFeelContext.Provider value={{
            ...lookAndFeel,
            setLookAndFeel,
        }}>
            {children}
        </LookAndFeelContext.Provider>
    )
}


LookAndFeel.Bluelib = LookAndFeelBluelib
LookAndFeel.Heading = LookAndFeelHeading
LookAndFeel.PageTitle = LookAndFeelPageTitle