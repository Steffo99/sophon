import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {Empty} from "../elements/Empty"
import {Loading} from "../elements/Loading"
import {ProjectResourcePanel} from "./ProjectResourcePanel"


export interface ProjectListBoxProps {
    viewSet: ManagedViewSet<SophonResearchProject>
}


export function ProjectListBox({viewSet}: ProjectListBoxProps): JSX.Element {
    const resources = React.useMemo(
        () => {
            if(!viewSet.resources) {
                return <Loading/>
            }
            if(viewSet.resources.length === 0) {
                return <Empty>This group owns no projects.</Empty>
            }
            return viewSet.resources?.filter(res => res !== undefined).map(res => <ProjectResourcePanel resource={res} key={res.value.slug}/>)
        },
        [viewSet],
    )

    return (
        <Box>
            <Heading level={3}>
                Research projects
            </Heading>
            <p>
                Research projects are containers for all kind of research data pertaining to a specific topic.
            </p>
            {resources}
        </Box>
    )
}
