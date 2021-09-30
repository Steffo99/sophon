import * as React from "react"
import {Bluelib} from "@steffo/bluelib-react";
import {useSophonInstance} from "./useSophonInstance";


export interface SophonInstanceBluelibProps {
    children: React.ReactNode,
}


/**
 * Component which wraps its children in a {@link Bluelib} component with a theme based on its instance.
 *
 * Defaults to the `"sophon"` theme if no instance is set.
 *
 * @constructor
 */
export function SophonInstanceBluelib({children}: SophonInstanceBluelibProps): JSX.Element {
    const instance = useSophonInstance()

    return (
        <Bluelib theme={instance?.theme ?? "sophon"}>
            {children}
        </Bluelib>
    )
}
