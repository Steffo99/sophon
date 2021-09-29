import * as React from "react"
import {Box, Heading} from "@steffo/bluelib-react";
import {SophonInstanceDetails} from "../../utils/SophonTypes";


export interface InstanceDescriptionBoxProps {
    instance?: SophonInstanceDetails
}


export function InstanceDescriptionBox({instance}: InstanceDescriptionBoxProps): JSX.Element | null {
    if (instance?.description) {
        return (
            <Box>
                <Heading level={3}>
                    Welcome to {instance.name}
                </Heading>
                <p>
                    {instance?.description}
                </p>
            </Box>
        )
    } else {
        return null
    }
}
