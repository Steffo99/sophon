import {faBook} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {Link} from "../elements/Link"
import {ResourcePanel} from "../elements/ResourcePanel"


export interface NotebookResourcePanelProps {
    resource: ManagedResource<SophonNotebook>,
}


export function NotebookResourcePanel({resource}: NotebookResourcePanelProps): JSX.Element {

    return (
        <ResourcePanel>
            <ResourcePanel.Icon>
                <FontAwesomeIcon icon={faBook}/>
            </ResourcePanel.Icon>
            <ResourcePanel.Name>
                <Link href={`n/${resource.value.slug}/`}>
                    {resource.value.name}
                </Link>
            </ResourcePanel.Name>
            <ResourcePanel.Text>

            </ResourcePanel.Text>
            <ResourcePanel.Buttons>

            </ResourcePanel.Buttons>
        </ResourcePanel>
    )
}
