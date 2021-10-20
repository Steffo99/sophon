import {faLightbulb} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {useGroupMembership} from "../group/useGroupMembership"


export interface NotebookStartButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookStartButton({resource}: NotebookStartButtonProps): JSX.Element | null {
    if(!useGroupMembership()) {
        return null
    }
    if(resource.value.is_running) {
        return null
    }
    if(resource.value.locked_by) {
        return null
    }

    return (
        <Button onClick={() => resource.action("PATCH", "start", {})} disabled={resource.busy}>
            <FontAwesomeIcon icon={faLightbulb} spin={resource.busy}/>&nbsp;Start
        </Button>
    )
}
