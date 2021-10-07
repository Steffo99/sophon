import {faEnvelope, faGlobe} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {Link} from "../elements/Link"
import {ResourcePanel} from "../elements/ResourcePanel"


export interface GroupResourcePanelProps {
    resource: ManagedResource<SophonResearchGroup>,
}


export function GroupResourcePanel({resource}: GroupResourcePanelProps): JSX.Element {
    const icon = resource.value.access === "OPEN" ? faGlobe : faEnvelope
    const members = resource.value.members.length

    return (
        <ResourcePanel>
            <ResourcePanel.Icon>
                <FontAwesomeIcon icon={icon}/>
            </ResourcePanel.Icon>
            <ResourcePanel.Name>
                <Link href={`g/${resource.value.slug}/`}>
                    {resource.value.name}
                </Link>
            </ResourcePanel.Name>
            <ResourcePanel.Text>
                {members} member{members !== 1 ? "s" : ""}
            </ResourcePanel.Text>
            <ResourcePanel.Buttons>

            </ResourcePanel.Buttons>
        </ResourcePanel>
    )
}
