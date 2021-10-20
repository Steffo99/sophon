import {faLock} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {useGroupMembership} from "../group/useGroupMembership"


export interface NotebookLockButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookLockButton({resource}: NotebookLockButtonProps): JSX.Element | null {
    if(!useGroupMembership()) {
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
