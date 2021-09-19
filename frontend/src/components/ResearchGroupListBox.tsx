import * as React from "react"
import * as ReactDOM from "react-dom"
import {useLoginAxios} from "./LoginContext";
import {useMemo} from "react";
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchGroupPanel, ResearchGroupPanelProps} from "./ResearchGroupPanel";


interface ResearchGroupListBoxProps {

}


export function ResearchGroupListBox({}: ResearchGroupListBoxProps): JSX.Element {
    const api = useLoginAxios()
    const loading = React.useState<boolean>()

    const data = React.useState<ResearchGroupPanelProps[]>([])

    return (
        <Box>
            <Heading level={3}>
                Research groups
            </Heading>
            <div>
                {data.map(group => <ResearchGroupPanel {...group}/>)}
            </div>
        </Box>
    )
}
