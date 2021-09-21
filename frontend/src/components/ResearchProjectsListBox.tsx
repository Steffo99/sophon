import * as React from "react"
import * as ReactDOM from "react-dom"
import {useDRFManagedList} from "../hooks/useDRF";
import {ResearchGroup, ResearchProject} from "../types";
import {Loading} from "./Loading";
import {ResearchGroupPanel} from "./ResearchGroupPanel";
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchProjectPanel} from "./ResearchProjectPanel";


export function ResearchProjectsListBox(): JSX.Element {
    const {resources} = useDRFManagedList<ResearchProject>(`/api/projects/by-slug/`, "slug")

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
            </div>
        </Box>
    )
}
