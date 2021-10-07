import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {NotebookResourcePanel} from "./NotebookResourcePanel"


export interface NotebookListBoxProps {
    viewSet: ManagedViewSet<SophonNotebook>
}


export function NotebookListBox({viewSet}: NotebookListBoxProps): JSX.Element {
    return (
        <Box>
            <Heading level={3}>
                Notebooks
            </Heading>
            <p>
                Notebooks are interactive Python documents that you can edit in your browser and run on Sophon server.
            </p>
            {viewSet.resources?.map(res => <NotebookResourcePanel resource={res} key={res.value.slug}/>)}
        </Box>
    )
}
