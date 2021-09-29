import * as React from "react"
import {Box} from "@steffo/bluelib-react";


interface ErrorBoxProps {
    error?: Error,
}


/**
 * Red {@link Box} which displays an {@link Error}.
 *
 * @param error - The {@link Error} to display.
 * @constructor
 */
export function ErrorBox({error}: ErrorBoxProps): JSX.Element | null {
    if (!error) {
        return null
    }

    return (
        <Box bluelibClassNames={"color-red"}>
            {error.toString()}
        </Box>
    )
}