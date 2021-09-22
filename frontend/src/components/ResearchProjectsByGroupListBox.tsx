import * as React from "react"
import {useDRFManagedList} from "../hooks/useDRF";
import {ResearchProject} from "../types";
import {Loading} from "./Loading";
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchProjectPanel} from "./ResearchProjectPanel";
import {NewResearchGroupPanel} from "./NewResearchGroupPanel";


interface ProjectsListBoxProps {
    group_pk: string
}


export function ResearchProjectsByGroupListBox({group_pk}: ProjectsListBoxProps): JSX.Element {
    const {resources} = useDRFManagedList<ResearchProject>(`/api/projects/by-group/${group_pk}/`, "slug")

    const groups = React.useMemo(
        () => {
            if(!resources) {
                return <Loading/>
            }
            return resources.map(
                (res, key) => <ResearchProjectPanel {...res} key={key}/>
            )
        },
        [resources]
    )

    return (
        <Box>
            <Heading level={3}>
                Research projects
            </Heading>
            <div>
                {groups}
                <NewResearchGroupPanel/>
            </div>
        </Box>
    )
}
