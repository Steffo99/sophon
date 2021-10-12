import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"


export interface GroupDescriptionBoxProps {
    resource: ManagedResource<SophonResearchGroup>
}


export function GroupDescriptionBox({resource}: GroupDescriptionBoxProps): JSX.Element {
    return (
        <Box>
            <Heading level={3}>
                {resource.value.name}
            </Heading>
            <pre>
                {resource.value.description}
            </pre>
        </Box>
    )
}
