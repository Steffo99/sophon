import {faCog} from "@fortawesome/free-solid-svg-icons"
import {navigate} from "@reach/router"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {CanBeDisabled} from "../../types/ExtraTypes"
import {IconText} from "../elements/IconText"


export function AuthorizationAdminPageButton({disabled = false}: CanBeDisabled): JSX.Element {
    const instance = useInstanceContext()

    const canAdministrate =
        React.useMemo(
            () => !disabled && instance,
            [disabled, instance],
        )

    const doAdministrate =
        React.useCallback(
            async () => {
                await navigate(`${instance!.state.url}admin`)
            },
            [instance],
        )


    return (
        <Button disabled={!canAdministrate} onClick={doAdministrate}>
            <IconText icon={faCog}>
                Go to the admin page
            </IconText>
        </Button>
    )
}
