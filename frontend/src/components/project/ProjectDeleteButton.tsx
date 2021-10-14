import {faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"


export interface ProjectDeleteButtonProps {
    resource: ManagedResource<SophonResearchProject>,
}


export function ProjectDeleteButton({resource}: ProjectDeleteButtonProps): JSX.Element | null {
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

    return (
        <SafetyButton timeout={3} onClick={() => resource.destroy()}>
            <FontAwesomeIcon icon={faTrash} pulse={resource.busy}/>&nbsp;Delete
        </SafetyButton>
    )
}
