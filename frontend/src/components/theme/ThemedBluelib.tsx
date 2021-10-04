import * as React from "react"
import {Bluelib} from "@steffo/bluelib-react";
import {useThemeContext} from "../../contexts/theme";


/**
 * The props of {@link ThemedBluelib}.
 */
export interface SophonInstanceBluelibProps {
    children: React.ReactNode,
}


/**
 * Component which wraps its children in a {@link Bluelib} component with a theme based on {@link useThemeContext}.
 *
 * Defaults to the `"sophon"` theme if no instance is set.
 *
 * @constructor
 */
export function ThemedBluelib({children}: SophonInstanceBluelibProps): JSX.Element {
    const instance = useThemeContext()
    const theme = instance?.state?.bluelib ?? "sophon"

    return (
        <Bluelib theme={theme}>
            {children}
        </Bluelib>
    )
}
