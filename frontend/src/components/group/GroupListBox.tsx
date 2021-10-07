import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {GroupResourcePanel} from "./GroupResourcePanel"


export interface GroupListBoxProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupListBox({viewSet}: GroupListBoxProps): JSX.Element {
    const instance = useInstanceContext()

    return (
        <Box>
            <Heading level={3}>
                Research groups on {instance?.state.details?.name}
            </Heading>
            <p>
                Research groups are groups of people that work together on one or more research projects.
            </p>
            {viewSet.resources?.map(res => <GroupResourcePanel resource={res} key={res.value.slug}/>)}
        </Box>
    )
}
