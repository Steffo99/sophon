import {faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"
import {useGroupMembership} from "../group/useGroupMembership"


export interface ProjectDeleteButtonProps {
    resource: ManagedResource<SophonResearchProject>,
}


export function ProjectDeleteButton({resource}: ProjectDeleteButtonProps): JSX.Element | null {
    if(!useGroupMembership()) {
        return null
    }

    return (
        <SafetyButton timeout={3} onClick={() => resource.destroy()}>
            <FontAwesomeIcon icon={faTrash} pulse={resource.busy}/>&nbsp;Delete
        </SafetyButton>
    )
}
