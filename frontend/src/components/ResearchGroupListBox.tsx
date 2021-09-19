import * as React from "react"
import * as ReactDOM from "react-dom"
import {useLoginAxios} from "./LoginContext";
import {useMemo} from "react";
import {Box, Heading} from "@steffo/bluelib-react";
import {ResearchGroupPanel} from "./ResearchGroupPanel";


interface ResearchGroupListBoxProps {

}


export function ResearchGroupListBox({}: ResearchGroupListBoxProps): JSX.Element {
    const api = useLoginAxios()

    return (
        <Box>
            <Heading level={3}>
                Research groups
            </Heading>
            <div>
                <ResearchGroupPanel/>
                <ResearchGroupPanel/>
                <ResearchGroupPanel/>
            </div>
        </Box>
    )
}
