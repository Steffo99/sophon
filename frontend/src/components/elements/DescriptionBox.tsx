import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Heading, Idiomatic} from "@steffo/bluelib-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"


export interface DescriptionBox {
    icon: IconDefinition,
    name: string,
    description: string,
}


export function DescriptionBox({icon, name, description}: DescriptionBox): JSX.Element {
    return React.useMemo(
        () => (
            <Box>
                <Heading level={3}>
                    <FontAwesomeIcon icon={icon}/>&nbsp;About <Idiomatic>{name}</Idiomatic>
                </Heading>
                <ReactMarkdown>
                    {description}
                </ReactMarkdown>
            </Box>
        ),
        [icon, name, description],
    )
}
