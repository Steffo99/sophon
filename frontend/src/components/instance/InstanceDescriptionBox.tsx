import {Box, Heading, Idiomatic} from "@steffo/bluelib-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import {useInstanceContext} from "../../contexts/instance"
import {ErrorBox} from "../errors/ErrorBox"


export function InstanceDescriptionBox(): JSX.Element | null {
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

    return (
        <Box>
            <Heading level={3}>
                About <Idiomatic>{instance.state.details.name}</Idiomatic>
            </Heading>
            <ReactMarkdown>
                {instance.state.details.description}
            </ReactMarkdown>
        </Box>
    )
}
