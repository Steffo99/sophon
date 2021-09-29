import * as React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faGlobe, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {Link} from "../elements/Link";
import {ResourcePanel} from "../elements/ResourcePanel";
import {SophonResearchGroup} from "../../utils/SophonTypes";


export function ResearchGroupPanel({owner, name, access, slug}: SophonResearchGroup): JSX.Element {
    let accessIcon: JSX.Element
    if (access === "OPEN") {
        accessIcon = <FontAwesomeIcon icon={faGlobe} title={"Open"}/>
    } else if (access === "MANUAL") {
        accessIcon = <FontAwesomeIcon icon={faEnvelope} title={"Invite-only"}/>
    } else {
        accessIcon = <FontAwesomeIcon icon={faQuestion} title={"Unknown"}/>
    }

    return (
        <ResourcePanel>
            <ResourcePanel.Icon>
                {accessIcon}
            </ResourcePanel.Icon>
            <ResourcePanel.Name>
                <Link href={`/g/${slug}/`}>{name}</Link>
            </ResourcePanel.Name>
            <ResourcePanel.Text>
                Created by {owner}
            </ResourcePanel.Text>
            <ResourcePanel.Buttons>

            </ResourcePanel.Buttons>
        </ResourcePanel>
    )
}
