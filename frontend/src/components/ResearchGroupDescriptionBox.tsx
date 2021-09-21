import * as React from "react"
import * as ReactDOM from "react-dom"
import {useDRFManagedDetail} from "../hooks/useDRF";
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchProject} from "../types";
import {Loading} from "./Loading";


interface ResearchGroupDescriptionBoxProps {
    pk: string,
}


export function ResearchGroupDescriptionBox({pk}: ResearchGroupDescriptionBoxProps): JSX.Element {
    const group = useDRFManagedDetail<ResearchProject>("/api/core/groups/", pk)

    if(group.resource) {
        return (
            <Box>
                <Heading level={3}>
                    {group.resource.name}
                </Heading>
                <p>
                    {group.resource.description}
                </p>
            </Box>
        )
    }
    else {
        return (
            <Box>
                <Loading/>
            </Box>
        )
    }
}
