import {faUserMinus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {SafetyButton} from "../elements/SafetyButton"


export interface GroupLeaveButtonProps {
    resource: ManagedResource<SophonResearchGroup>,
}


export function GroupLeaveButton({resource}: GroupLeaveButtonProps): JSX.Element | null {
    const authorization = useAuthorizationContext()

    const trueMembers = [...new Set([resource.value.owner, ...resource.value.members])]

    const doLeave =
        React.useCallback(
            async () => {
                await resource.action("DELETE", "leave", {})
            },
            [resource],
        )

    if(!authorization) {
        return null
    }
    if(!authorization.state.user) {
        return null
    }
    if(!trueMembers.includes(authorization.state.user.id)) {
        return null
    }
    if(resource.value.owner === authorization.state.user.id) {
        return null
    }

    return (
        <SafetyButton timeout={3} disabled={resource.busy} onClick={doLeave} bluelibClassNames={resource.busy ? "color-yellow" : ""}>
            <FontAwesomeIcon icon={faUserMinus} pulse={resource.busy}/>&nbsp;Leave
        </SafetyButton>
    )
}
