import * as React from "react"
import {LookAndFeelBluelib} from "./LookAndFeelBluelib";
import {LookAndFeelHeading} from "./LookAndFeelHeading";
import {LookAndFeelPageTitle} from "./LookAndFeelPageTitle";


export interface LookAndFeelState {
    bluelibTheme: "sophon" | "royalblue" | "paper" | "hacker",
    pageTitle: string,
    backendVersion?: string,
}


export interface LookAndFeelContextData extends LookAndFeelState {
    setLookAndFeel: React.Dispatch<React.SetStateAction<LookAndFeelState>>,
}


export const LookAndFeelContext = React.createContext<LookAndFeelContextData>({
    bluelibTheme: "sophon",
    pageTitle: "Sophon",
    backendVersion: undefined,

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
            backendVersion: undefined,
        })

    return (
        <LookAndFeelContext.Provider
            value={{
                ...lookAndFeel,
                setLookAndFeel,
            }}
        >
            {children}
        </LookAndFeelContext.Provider>
    )
}


export function useLookAndFeel() {
    return React.useContext(LookAndFeelContext)
}


LookAndFeel.Bluelib = LookAndFeelBluelib
LookAndFeel.Heading = LookAndFeelHeading
LookAndFeel.PageTitle = LookAndFeelPageTitle