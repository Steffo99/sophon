import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {ProjectResourcePanel} from "./ProjectResourcePanel"


export interface ProjectListBoxProps {
    viewSet: ManagedViewSet<SophonResearchProject>
}


export function ProjectListBox({viewSet}: ProjectListBoxProps): JSX.Element {
    return (
        <Box>
            <Heading level={3}>
                Research projects
            </Heading>
            <p>
                Research projects are containers for all kind of research data pertaining to a specific topic.
            </p>
            {viewSet.resources?.map(res => <ProjectResourcePanel resource={res} key={res.value.slug}/>)}
        </Box>
    )
}
