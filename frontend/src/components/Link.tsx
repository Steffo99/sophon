import * as React from "react"
import {Anchor} from "@steffo/bluelib-react";
import {navigate} from "@reach/router";
import {AnchorProps} from "@steffo/bluelib-react/dist/components/common/Anchor";


interface LinkProps extends AnchorProps {

}


export function Link({href, children, onClick, ...props}: AnchorProps): JSX.Element {

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
        [href]
    )

    return (
        <Anchor href={href} children={children} onClick={onClickWrapped} {...props}/>
    )
}
