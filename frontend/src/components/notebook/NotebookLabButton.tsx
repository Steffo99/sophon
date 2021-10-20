import {faFlask} from "@fortawesome/free-solid-svg-icons"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useNotebookContext} from "../../contexts/notebook"
import {IconText} from "../elements/IconText"


export function NotebookLabButton(): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const notebook = useNotebookContext()

    const canOpen =
        React.useMemo(
            () => authorization &&
                notebook &&
                (
                    notebook.value.locked_by === null || notebook.value.locked_by === authorization?.state.user?.id
                ),
            [notebook, authorization],
        )

    if(!notebook) {
        return null
    }
    if(!notebook.value.lab_url) {
        return null
    }

    return (
        <Button onClick={() => window.open(notebook.value.lab_url!)} disabled={!canOpen}>
            <IconText icon={faFlask}>
                Open JupyterLab
            </IconText>
        </Button>
    )
}
