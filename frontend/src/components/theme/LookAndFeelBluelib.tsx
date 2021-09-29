import * as React from "react"
import {useContext} from "react";
import {LookAndFeelContext} from "./LookAndFeel";
import {Bluelib} from "@steffo/bluelib-react";


interface LookAndFeelBluelibProps {
    children: React.ReactNode,
}


export function LookAndFeelBluelib({children}: LookAndFeelBluelibProps): JSX.Element {
    const lookAndFeel = useContext(LookAndFeelContext)

    return (
        <Bluelib theme={lookAndFeel.bluelibTheme}>
            {children}
        </Bluelib>
    )
}
