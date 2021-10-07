import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {NotebookResourcePanel} from "./NotebookResourcePanel"


export interface NotebookListBoxProps {
    viewSet: ManagedViewSet<SophonNotebook>
}


export function NotebookListBox({viewSet}: NotebookListBoxProps): JSX.Element {
    // TODO: Add some flavour text

    return (
        <Box>
            <Heading level={3}>
                Notebooks
            </Heading>
            {viewSet.resources?.map(res => <NotebookResourcePanel resource={res} key={res.value.slug}/>)}
        </Box>
    )
}
