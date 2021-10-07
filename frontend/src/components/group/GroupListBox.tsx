import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {ListRouteProps} from "../routing/ViewSetRouter"
import {GroupResourcePanel} from "./GroupResourcePanel"


export interface GroupListBoxProps extends ListRouteProps<SophonResearchGroup> {

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
