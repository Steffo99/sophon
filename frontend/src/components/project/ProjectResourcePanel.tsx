import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import {faGlobe, faLock, faUniversity} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {Link} from "../elements/Link"
import {ResourcePanel} from "../elements/ResourcePanel"
import {ProjectDeleteButton} from "./ProjectDeleteButton"


export interface ProjectResourcePanelProps {
    resource: ManagedResource<SophonResearchProject>,
}


export function ProjectResourcePanel({resource}: ProjectResourcePanelProps): JSX.Element {
    const icon: IconDefinition = {
        "PUBLIC": faGlobe,
        "INTERNAL": faUniversity,
        "PRIVATE": faLock,
    }[resource.value.visibility]

    return (
        <ResourcePanel>
            <ResourcePanel.Icon>
                <FontAwesomeIcon icon={icon}/>
            </ResourcePanel.Icon>
            <ResourcePanel.Name>
                <Link href={`p/${resource.value.slug}/`}>
                    {resource.value.name}
                </Link>
            </ResourcePanel.Name>
            <ResourcePanel.Text>

            </ResourcePanel.Text>
            <ResourcePanel.Buttons>
                <ProjectDeleteButton resource={resource}/>
            </ResourcePanel.Buttons>
        </ResourcePanel>
    )
}
