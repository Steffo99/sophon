import * as React from "react"
import * as ReactDOM from "react-dom"
import {useLoginAxios} from "./LoginContext";
import {useMemo} from "react";
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchGroupPanel} from "./ResearchGroupPanel";
import {DRFList, ResearchGroup} from "../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {useDRFManagedViewSet} from "../hooks/useDRF";


interface ResearchGroupListBoxProps {

}


export function ResearchGroupListBox({}: ResearchGroupListBoxProps): JSX.Element {
    const {resources, refreshing} = useDRFManagedViewSet<ResearchGroup>("/api/core/groups/", "slug")

    const groups = React.useMemo(
        () => {
            if(refreshing) {
                return <span><FontAwesomeIcon icon={faSpinner} pulse={true}/> Loading...</span>
            }
            return resources.map(
                res => <ResearchGroupPanel {...res}/>
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
