import {faLockOpen} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"


export interface NotebookUnlockButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookUnlockButton({resource}: NotebookUnlockButtonProps): JSX.Element | null {
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
    if(!resource.value.locked_by) {
        return null
    }

    if(resource.value.locked_by === authorization.state.user.id) {
        return (
            <Button onClick={() => resource.action("PATCH", "unlock", {})} disabled={resource.busy}>
                <FontAwesomeIcon icon={faLockOpen} spin={resource.busy}/>&nbsp;Unlock
            </Button>
        )
    }

    return (
        <SafetyButton timeout={3} onClick={() => resource.action("PATCH", "unlock", {})} disabled={resource.busy}>
            <FontAwesomeIcon icon={faLockOpen} spin={resource.busy}/>&nbsp;Unlock
        </SafetyButton>
    )
}
