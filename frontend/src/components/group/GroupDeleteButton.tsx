import {faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"


export interface GroupDeleteButtonProps {
    resource: ManagedResource<SophonResearchGroup>,
}


export function GroupDeleteButton({resource}: GroupDeleteButtonProps): JSX.Element | null {
    const authorization = useAuthorizationContext()

    const doDelete =
        React.useCallback(
            async () => {
                await resource.destroy()
            },
            [resource],
        )

    if(!authorization) {
        return null
    }
    if(!authorization.state.user) {
        return null
    }
    if(resource.value.owner !== authorization.state.user.id) {
        return null
    }

    return (
        <SafetyButton timeout={3} onClick={doDelete}>
            <FontAwesomeIcon icon={faTrash} pulse={resource.busy}/>&nbsp;Delete
        </SafetyButton>
    )
}
