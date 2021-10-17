import {faChevronRight} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"


export function BreadcrumbSeparator(): JSX.Element {
    return <>
        &nbsp;
        <FontAwesomeIcon icon={faChevronRight}/>
        &nbsp;
    </>
}