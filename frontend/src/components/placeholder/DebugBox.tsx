import * as React from "react"
import {Box, Code} from "@steffo/bluelib-react";


export interface DebugBoxProps {
    [key: string]: any,
}


export function DebugBox(props: DebugBoxProps): JSX.Element {
    return (
        <Box todo={true}>
            <Code>
                <pre>
                    {JSON.stringify(props, undefined, 4)}
                </pre>
            </Code>
        </Box>
    )
}
