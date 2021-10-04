import * as React from "react"
import {Anchor, Footer} from "@steffo/bluelib-react";


/**
 * A map of environments to bluelibClassNames to apply to the {@link SophonFooter}.
 */
const FOOTER_COLORS = {
    development: "color-yellow",
    test: "color-cyan",
    production: "",
}


/**
 * Component which renders the footer displayed at the bottom of every page.
 *
 * Changes color based on the current environment (see {@link FOOTER_COLORS}):
 *
 * - **yellow** for `development`;
 * - **cyan** for `test`;
 * - **foreground** for `production`.
 *
 * @constructor
 */
export function SophonFooter(): JSX.Element {
    return (
        <Footer bluelibClassNames={FOOTER_COLORS[process.env.NODE_ENV]}>
            <span>
                © {new Date().getFullYear()} Stefano Pigozzi
            </span>
            &nbsp;|&nbsp;
            <Anchor href={"https://github.com/Steffo99/sophon/blob/main/LICENSE.txt"}>
                AGPL 3.0+
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={"https://github.com/Steffo99/sophon"}>
                GitHub
            </Anchor>
        </Footer>
    )
}
