import {Box, Heading, Idiomatic} from "@steffo/bluelib-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"


export interface GroupDescriptionBoxProps {
    resource: ManagedResource<SophonResearchGroup>
}


export function GroupDescriptionBox({resource}: GroupDescriptionBoxProps): JSX.Element {
    return (
        <Box>
            <Heading level={3}>
                About <Idiomatic>{resource.value.name}</Idiomatic>
            </Heading>
            <ReactMarkdown>
                {resource.value.description}
            </ReactMarkdown>
        </Box>
    )
}
