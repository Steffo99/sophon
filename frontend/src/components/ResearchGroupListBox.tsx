import * as React from "react"
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchGroupPanel} from "./ResearchGroupPanel";
import {ResearchGroup} from "../types";
import {useDRFManagedList} from "../hooks/useDRF";
import {Loading} from "./Loading";


export function ResearchGroupListBox(): JSX.Element {
    const {resources} = useDRFManagedList<ResearchGroup>("/api/core/groups/", "slug")

    const groups = React.useMemo(
        () => {
            if(!resources) {
                return <Loading/>
            }
            return resources.map(
                (res, key) => <ResearchGroupPanel {...res} key={key}/>
            )
        },
        [resources]
    )

    return (
        <Box>
            <Heading level={3}>
                Research groups
            </Heading>
            <div>
                {groups}
            </div>
        </Box>
    )
}
