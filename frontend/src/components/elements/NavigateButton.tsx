import * as Reach from "@reach/router"
import {Button} from "@steffo/bluelib-react"
import {ButtonProps} from "@steffo/bluelib-react/dist/components/inputs/Button"
import * as React from "react"


/**
 * The props of {@link NavigateButton}.
 */
export interface NavigateButtonProps extends ButtonProps {
    href: string,
}


/**
 * A button functioning like a {@link Link}.
 *
 * @constructor
 */
export function NavigateButton({href, children, onClick, ...props}: NavigateButtonProps): JSX.Element {
    const location = Reach.useLocation()

    const onClickWrapped = React.useCallback(
        event => {
            event.preventDefault()
            if(onClick) {
                onClick(event)
            }
            if(href) {
                // noinspection JSIgnoredPromiseFromCall
                Reach.navigate(href)
            }
        },
        [href, onClick],
    )

    return (
        <Button children={children} onClick={onClickWrapped} disabled={location.pathname === href} {...props}/>
    )
}
