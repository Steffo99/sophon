import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {GroupResourcePanel} from "./GroupResourcePanel"


export interface GroupListBoxProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupListBox({viewSet}: GroupListBoxProps): JSX.Element {
    // TODO: Add some flavour text

    return (
        <Box>
            <Heading level={3}>
                Research groups
            </Heading>
            {viewSet.resources?.map(res => <GroupResourcePanel resource={res} key={res.value.slug}/>)}
        </Box>
    )
}
