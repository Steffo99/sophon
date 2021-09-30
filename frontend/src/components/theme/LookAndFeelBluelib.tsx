import * as React from "react"
import {useLookAndFeel} from "./LookAndFeel";
import {Bluelib} from "@steffo/bluelib-react";


interface LookAndFeelBluelibProps {
    children: React.ReactNode,
}


export function LookAndFeelBluelib({children}: LookAndFeelBluelibProps): JSX.Element {
    const lookAndFeel = useLookAndFeel()

    return (
        <Bluelib theme={lookAndFeel.bluelibTheme}>
            {children}
        </Bluelib>
    )
}
