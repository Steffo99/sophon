import * as React from "react"
import * as ReactDOM from "react-dom"
import {RouteComponentProps} from "@reach/router";
import {Box, Heading} from "@steffo/bluelib-react";


export interface NotFoundBoxProps extends RouteComponentProps {}


/**
 * Red {@link Box} that displays a "Not found" error.
 *
 * Supports {@link RouteComponentProps} for direct inclusion in a router.
 *
 * @constructor
 */
export function NotFoundBox({}: NotFoundBoxProps) {
    return (
        <Box bluelibClassNames={"color-red"}>
            <Heading level={3}>
                Not found
            </Heading>
            <p>
                The page you were looking for was not found.
            </p>
        </Box>
    )
}