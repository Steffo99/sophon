import * as React from "react"
import {Box, Heading} from "@steffo/bluelib-react";
import {useInstance} from "./InstanceContext";


export function InstanceDescriptionBox(): JSX.Element | null {
    const instance = useInstance()

    if(instance.details?.description) {
        return (
            <Box>
                <Heading level={3}>
                    Welcome
                </Heading>
                <p>
                    {instance.details.description}
                </p>
            </Box>
        )
    }
    else {
        return null
    }
}
