import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome"
import * as React from "react"


/**
 * The props of {@link IconText}.
 */
export interface IconTextProps extends FontAwesomeIconProps {
    children: React.ReactNode,
}


/**
 * A {@link FontAwesomeIcon} (`icon`) followed by some text (`children`).
 *
 * @constructor
 */
export function IconText({children, ...props}: IconTextProps): JSX.Element {
    return (
        <span>
            <FontAwesomeIcon {...props}/>&nbsp;{children}
        </span>
    )
}