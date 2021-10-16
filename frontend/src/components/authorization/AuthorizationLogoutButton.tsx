import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {CanBeDisabled} from "../../types/ExtraTypes"
import {IconText} from "../elements/IconText"


export function AuthorizationLogoutButton({disabled = false}: CanBeDisabled): JSX.Element {
    const authorization =
        useAuthorizationContext()

    const canLogout =
        React.useMemo(
            () => (
                !disabled && authorization !== undefined && authorization.state.user !== undefined && !authorization.state.running
            ),
            [disabled, authorization],
        )

    const onClick =
        React.useCallback(
            () => authorization!.dispatch({type: "clear"}),
            [authorization],
        )

    return (
        <Button disabled={!canLogout} onClick={onClick}>
            <IconText icon={faSignOutAlt}>
                Logout
            </IconText>
        </Button>
    )
}
