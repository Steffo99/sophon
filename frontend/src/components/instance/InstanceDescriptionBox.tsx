import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {ErrorBox} from "../errors/ErrorBox"


export interface InstanceDescriptionBoxProps {

}


export function InstanceDescriptionBox({}: InstanceDescriptionBoxProps): JSX.Element | null {
    const instance = useInstanceContext()

    if(!instance) {
        return <ErrorBox error={new Error("This component is being rendered outside an InstanceContext.")}/>
    }

    if(!instance.state.details) {
        return null
    }

    if(!instance.state.details.description) {
        return null
    }

    // TODO: In the future, it would be nice for this to be parsed as Markdown!
    return (
        <Box>
            <Heading level={3}>
                Welcome to {instance.state.details.name}!
            </Heading>
            <pre>
                {instance.state.details.description}
            </pre>
        </Box>
    )
}
