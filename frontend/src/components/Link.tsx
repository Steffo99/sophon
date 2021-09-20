import * as React from "react"
import {Anchor, BringAttention as B} from "@steffo/bluelib-react";
import {navigate, useLocation} from "@reach/router";
import {AnchorProps} from "@steffo/bluelib-react/dist/components/common/Anchor";


export function Link({href, children, onClick, ...props}: AnchorProps): JSX.Element {
    const location = useLocation()

    const onClickWrapped = React.useCallback(
        event => {
            event.preventDefault()
            if(onClick) {
                onClick(event)
            }
            if(href) {
                // noinspection JSIgnoredPromiseFromCall
                navigate(href)
            }
        },
        [href, onClick]
    )

    if(location.pathname === href) {
        return (
            <B children={children} {...props}/>
        )
    }
    else {
        return (
            <Anchor href={href} children={children} onClick={onClickWrapped} {...props}/>
        )
    }
}
