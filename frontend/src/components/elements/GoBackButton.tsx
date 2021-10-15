import {faLevelUpAlt} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as Reach from "@reach/router"
import {Button} from "@steffo/bluelib-react"
import {ButtonProps} from "@steffo/bluelib-react/dist/components/inputs/Button"
import * as React from "react"
import {useSophonPath} from "../../hooks/useSophonPath"


/**
 * A button that takes the user back one sophon level (so two levels).
 *
 * @constructor
 */
export function GoBackButton({onClick, ...props}: Omit<ButtonProps, "children">): JSX.Element {
    const location = useSophonPath()

    const onClickWrapped = React.useCallback(
        async event => {
            event.preventDefault()
            if(onClick) {
                onClick(event)
            }
            await Reach.navigate("../..")
        },
        [onClick],
    )

    return (
        <Button onClick={onClickWrapped} disabled={location.count === 0} {...props}>
            <FontAwesomeIcon icon={faLevelUpAlt}/>&nbsp;Go up
        </Button>
    )
}
