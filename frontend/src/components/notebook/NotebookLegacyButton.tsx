import {faBook} from "@fortawesome/free-solid-svg-icons"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useNotebookContext} from "../../contexts/notebook"
import {IconText} from "../elements/IconText"
import {NavigateButton} from "../elements/NavigateButton"


export function NotebookLegacyButton(): JSX.Element | null {
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
    if(!notebook.value.legacy_notebook_url) {
        return null
    }

    return (
        <NavigateButton href={notebook.value.legacy_notebook_url} disabled={!canOpen}>
            <IconText icon={faBook}>
                Open legacy Jupyter Notebook
            </IconText>
        </NavigateButton>
    )
}
