import * as React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";


interface LoadingProps {
    text?: string,
}


export function Loading({text = "Loading..."}: LoadingProps): JSX.Element {
    return (
        <span>
            <FontAwesomeIcon icon={faSpinner} pulse={true}/> {text}
        </span>
    )
}
