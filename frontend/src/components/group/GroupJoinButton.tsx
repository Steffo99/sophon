import {faUserPlus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"


export interface GroupJoinButtonProps {
    resource: ManagedResource<SophonResearchGroup>,
}


export function GroupJoinButton({resource}: GroupJoinButtonProps): JSX.Element | null {
    const authorization = useAuthorizationContext()

    const doJoin =
        React.useCallback(
            async () => {
                await resource.action("POST", "join", {})
            },
            [resource],
        )

    if(!authorization) {
        return null
    }
    if(!authorization.state.user) {
        return null
    }
    if(resource.value.members.includes(authorization.state.user.id)) {
        return null
    }

    const canJoin = !resource.busy && resource.value.access === "OPEN"

    return (
        <Button disabled={!canJoin} onClick={doJoin} bluelibClassNames={resource.busy ? "color-yellow" : ""}>
            <FontAwesomeIcon icon={faUserPlus}/>&nbsp;Join
        </Button>
    )
}
