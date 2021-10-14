import {faLock} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"


export interface NotebookLockButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookLockButton({resource}: NotebookLockButtonProps): JSX.Element | null {
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
    if(resource.value.locked_by) {
        return null
    }

    return (
        <Button onClick={() => resource.action("PATCH", "lock", {})} disabled={resource.busy}>
            <FontAwesomeIcon icon={faLock} spin={resource.busy}/>&nbsp;Lock
        </Button>
    )
}
