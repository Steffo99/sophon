import * as React from "react"
import * as Reach from "@reach/router"
import {Anchor, BringAttention as B} from "@steffo/bluelib-react";
import {AnchorProps} from "@steffo/bluelib-react/dist/components/common/Anchor";


/**
 * Re-implementation of the {@link Reach.Link} component using the Bluelib {@link Anchor}.
 *
 * @constructor
 */
export function Link({href, children, onClick, ...props}: AnchorProps): JSX.Element {
    const location = Reach.useLocation()

    const onClickWrapped = React.useCallback(
        event => {
            event.preventDefault()
            if (onClick) {
                onClick(event)
            }
            if (href) {
                // noinspection JSIgnoredPromiseFromCall
                Reach.navigate(href)
            }
        },
        [href, onClick]
    )

    if (location.pathname === href) {
        return (
            <B children={children} {...props}/>
        )
    } else {
        return (
            <Anchor href={href} children={children} onClick={onClickWrapped} {...props}/>
        )
    }
}
