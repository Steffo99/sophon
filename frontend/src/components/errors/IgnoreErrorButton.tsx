import {faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"


export interface IgnoreErrorButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}


export function IgnoreErrorButton({onClick}: IgnoreErrorButtonProps): JSX.Element {
    return (
        <Button onClick={onClick}>
            <FontAwesomeIcon icon={faAngleDoubleRight}/>&nbsp;Try ignoring the error
        </Button>
    )
}
