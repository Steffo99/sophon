import {faBook} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, BringAttention as B, Code, Form, Heading, Idiomatic as I} from "@steffo/bluelib-react"
import * as React from "react"
import {useCacheContext} from "../../contexts/cache"
import {useNotebookContext} from "../../contexts/notebook"
import {NotebookLabButton} from "./NotebookLabButton"
import {NotebookLegacyButton} from "./NotebookLegacyButton"


export function NotebookDescriptionBox(): JSX.Element | null {
    const cache = useCacheContext()
    const notebook = useNotebookContext()

    if(notebook) {
        var locked_by = cache?.getUserById(notebook.value.locked_by)?.value.username
    }

    const locked_text =
        React.useMemo(
            () => {
                if(!locked_by) {
                    return null
                }

                return (
                    <>, currently <B>locked by {locked_by}</B></>
                )
            },
            [locked_by],
        )

    if(!notebook) {
        return null
    }

    return (
        <Box builtinColor={locked_by ? "magenta" : undefined}>
            <Heading level={3}>
                <FontAwesomeIcon icon={faBook}/>&nbsp;About <I>{notebook.value.name}</I>
            </Heading>
            <p>
                A <B>{notebook.value.is_running ? "running" : "stopped"}</B> notebook using <B><Code>{notebook.value.container_image}</Code></B>{locked_text}.
            </p>
            {
                notebook.value.is_running ? (
                    <Form>
                        <Form.Row>
                            <NotebookLabButton/>
                            <NotebookLegacyButton/>
                        </Form.Row>
                    </Form>
                ) : null
            }
        </Box>
    )
}
