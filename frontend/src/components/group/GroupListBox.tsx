import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {Empty} from "../elements/Empty"
import {Loading} from "../elements/Loading"
import {GroupResourcePanel} from "./GroupResourcePanel"


export interface GroupListBoxProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupListBox({viewSet}: GroupListBoxProps): JSX.Element {
    const resources = React.useMemo(
        () => {
            if(!viewSet.resources) {
                return <Loading/>
            }
            if(viewSet.resources.length === 0) {
                return <Empty>This Sophon instance has no groups.</Empty>
            }
            return viewSet.resources?.filter(res => res !== undefined).map(res => <GroupResourcePanel resource={res} key={res.value?.slug}/>)
        },
        [viewSet],
    )

    return (
        <Box>
            <Heading level={3}>
                Research groups
            </Heading>
            <p>
                Research groups are groups of people that work together on one or more research projects.
            </p>
            {resources}
        </Box>
    )
}
