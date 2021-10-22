import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {Empty} from "../elements/Empty"
import {Loading} from "../elements/Loading"
import {NotebookResourcePanel} from "./NotebookResourcePanel"


export interface NotebookListBoxProps {
    viewSet: ManagedViewSet<SophonNotebook>
}


export function NotebookListBox({viewSet}: NotebookListBoxProps): JSX.Element {
    const resources = React.useMemo(
        () => {
            if(!viewSet.resources) {
                return <Loading/>
            }
            if(viewSet.resources.length === 0) {
                return <Empty>This project has no notebooks.</Empty>
            }
            return viewSet.resources?.filter(res => res !== undefined).map(res => <NotebookResourcePanel resource={res} key={res.value.slug}/>)
        },
        [viewSet],
    )

    return (
        <Box>
            <Heading level={3}>
                Notebooks
            </Heading>
            <p>
                Notebooks are interactive Python documents that you can edit in your browser and run on Sophon server.
            </p>
            {resources}
        </Box>
    )
}
