import {faSignInAlt} from "@fortawesome/free-solid-svg-icons"
import {navigate} from "@reach/router"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {useSophonPath} from "../../hooks/useSophonPath"
import {CanBeDisabled} from "../../types/ExtraTypes"
import {IconText} from "../elements/IconText"


export function AuthorizationGoToSophonButton({disabled = false}: CanBeDisabled): JSX.Element {
    const instance = useInstanceContext()
    const location = useSophonPath()

    const canGoTo =
        React.useMemo(
            () => !disabled && instance && !location.loggedIn,
            [disabled, instance, location],
        )

    const doGoTo =
        React.useCallback(
            () => navigate("l/logged-in/"),
            [],
        )

    return (
        <Button onClick={doGoTo} disabled={!canGoTo}>
            <IconText icon={faSignInAlt}>
                Go to {instance?.state.details?.name}
            </IconText>
        </Button>
    )
}
