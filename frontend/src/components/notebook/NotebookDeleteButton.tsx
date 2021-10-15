import {faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"


export interface NotebookDeleteButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookDeleteButton({resource}: NotebookDeleteButtonProps): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const group = useGroupContext()

    if(!authorization) {
        return null
    }
    if(!group) {
        return null
    }
    if(!authorization.state.user) {
        return null
    }
    if(!(
        group.value.members.includes(authorization.state.user.id) || group.value.owner === authorization.state.user.id
    )) {
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
