import * as React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";


interface LoadingProps {
    text?: string,
}


/**
 * An inline component which displays a {@link faSpinner} with some loading text.
 *
 * @param text - The text to display (defaults to `"Loading..."`)
 * @constructor
 */
export function Loading({text = "Loading..."}: LoadingProps): JSX.Element {
    return (
        <span>
            <FontAwesomeIcon icon={faSpinner} pulse={true}/> {text}
        </span>
    )
}
