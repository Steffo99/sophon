import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Heading, Idiomatic} from "@steffo/bluelib-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import {Empty} from "./Empty"


export interface DescriptionBoxProps {
    icon: IconDefinition,
    name: string,
    description?: string | null,
}


export function DescriptionBox({icon, name, description}: DescriptionBoxProps): JSX.Element {
    return React.useMemo(
        () => (
            <Box>
                <Heading level={3}>
                    <FontAwesomeIcon icon={icon}/>&nbsp;About <Idiomatic>{name}</Idiomatic>
                </Heading>
                {
                    description ?
                    <ReactMarkdown>
                        {description}
                    </ReactMarkdown>
                                :
                    <Empty>
                        This resource has no about text.
                    </Empty>
                }
            </Box>
        ),
        [icon, name, description],
    )
}
