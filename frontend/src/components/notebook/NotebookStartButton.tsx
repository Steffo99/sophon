import {faLightbulb} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"


export interface NotebookStartButtonProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookStartButton({resource}: NotebookStartButtonProps): JSX.Element | null {
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
        <Button onClick={() => resource.action("PATCH", "start", {})} disabled={resource.busy}>
            <FontAwesomeIcon icon={faLightbulb} spin={resource.busy}/>&nbsp;Start
        </Button>
    )
}
