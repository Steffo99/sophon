import {faExpand} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import Style from "./Empty.module.css"


export interface EmptyProps {
    children: React.ReactNode,
}


export function Empty({children}: EmptyProps): JSX.Element {
    return (
        <span className={Style.Empty}>
            <FontAwesomeIcon icon={faExpand}/>&nbsp;{children}
        </span>
    )
}
