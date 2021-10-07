import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {ProjectResourcePanel} from "./ProjectResourcePanel"


export interface ProjectListBoxProps {
    viewSet: ManagedViewSet<SophonResearchProject>
}


export function ProjectListBox({viewSet}: ProjectListBoxProps): JSX.Element {
    // TODO: Add some flavour text

    return (
        <Box>
            <Heading level={3}>
                Research projects
            </Heading>
            {viewSet.resources?.map(res => <ProjectResourcePanel resource={res} key={res.value.slug}/>)}
        </Box>
    )
}
