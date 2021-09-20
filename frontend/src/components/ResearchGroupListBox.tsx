import * as React from "react"
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchGroupPanel} from "./ResearchGroupPanel";
import {ResearchGroup} from "../types";
import {useDRFManagedViewSet} from "../hooks/useDRF";
import {Loading} from "./Loading";


interface ResearchGroupListBoxProps {

}


export function ResearchGroupListBox({}: ResearchGroupListBoxProps): JSX.Element {
    const {resources, refreshing} = useDRFManagedViewSet<ResearchGroup>("/api/core/groups/", "slug")

    const groups = React.useMemo(
        () => {
            if(refreshing) {
                return <Loading/>
            }
            return resources.map(
                (res, key) => <ResearchGroupPanel {...res} key={key}/>
            )
        },
        [resources, refreshing]
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
