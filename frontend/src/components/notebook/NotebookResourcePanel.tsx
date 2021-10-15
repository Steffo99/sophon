import {faBook} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {useCacheContext} from "../../contexts/cache"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {Link} from "../elements/Link"
import {ResourcePanel} from "../elements/ResourcePanel"
import {NotebookDeleteButton} from "./NotebookDeleteButton"
import {NotebookLockButton} from "./NotebookLockButton"
import {NotebookStartButton} from "./NotebookStartButton"
import {NotebookStopButton} from "./NotebookStopButton"
import {NotebookUnlockButton} from "./NotebookUnlockButton"


export interface NotebookResourcePanelProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookResourcePanel({resource}: NotebookResourcePanelProps): JSX.Element {
    const cache = useCacheContext()

    const locked_by = cache?.getUserById(resource.value.locked_by)?.value.username

    return (
        <ResourcePanel builtinColor={locked_by ? "blue" : undefined}>
            <ResourcePanel.Icon>
                <FontAwesomeIcon icon={faBook}/>
            </ResourcePanel.Icon>
            <ResourcePanel.Name>
                <Link href={`n/${resource.value.slug}/`}>
                    {resource.value.name}
                </Link>
            </ResourcePanel.Name>
            <ResourcePanel.Text>
                {
                    resource.value.locked_by
                    ?
                    `Locked by ${locked_by}`
                    :
                    null
                }
            </ResourcePanel.Text>
            <ResourcePanel.Buttons>
                <NotebookDeleteButton resource={resource}/>
                <NotebookStopButton resource={resource}/>
                <NotebookStartButton resource={resource}/>
                <NotebookUnlockButton resource={resource}/>
                <NotebookLockButton resource={resource}/>
            </ResourcePanel.Buttons>
        </ResourcePanel>
    )
}
