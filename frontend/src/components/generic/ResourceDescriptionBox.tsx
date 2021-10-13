import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Heading, Idiomatic} from "@steffo/bluelib-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import {ManagedResource} from "../../hooks/useManagedViewSet"


export interface NamedAndDescribed {
    name: string,
    description: string,
}


export interface ResourceDescriptionBoxProps<T extends NamedAndDescribed> {
    resource: ManagedResource<T>,
    icon: IconDefinition,
}


export function ResourceDescriptionBox<T extends NamedAndDescribed>({resource, icon}: ResourceDescriptionBoxProps<T>): JSX.Element {
    return React.useMemo(
        () => (
            <Box>
                <Heading level={3}>
                    <FontAwesomeIcon icon={icon}/>&nbsp;About <Idiomatic>{resource.value.name}</Idiomatic>
                </Heading>
                <ReactMarkdown>
                    {resource.value.description}
                </ReactMarkdown>
            </Box>
        ),
        [resource],
    )
}
