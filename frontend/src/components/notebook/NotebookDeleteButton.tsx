import {faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"
import {useGroupMembership} from "../group/useGroupMembership"


export interface NotebookDeleteButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookDeleteButton({resource}: NotebookDeleteButtonProps): JSX.Element | null {
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
        <SafetyButton timeout={3} onClick={() => resource.destroy()} disabled={resource.busy}>
            <FontAwesomeIcon icon={faTrash} spin={resource.busy}/>&nbsp;Delete
        </SafetyButton>
    )
}
