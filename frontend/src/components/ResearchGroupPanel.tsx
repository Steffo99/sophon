import * as React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faGlobe, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {ResearchGroup} from "../types";
import {UserLink} from "./UserLink";
import {Link} from "./Link";
import {ObjectPanel} from "./ObjectPanel";


export function ResearchGroupPanel({owner, name, access, slug}: ResearchGroup): JSX.Element {
    let accessIcon: JSX.Element
    if(access === "OPEN") {
        accessIcon = <FontAwesomeIcon icon={faGlobe} title={"Open"}/>
    }
    else if(access === "MANUAL") {
        accessIcon = <FontAwesomeIcon icon={faEnvelope} title={"Invite-only"}/>
    }
    else {
        accessIcon = <FontAwesomeIcon icon={faQuestion} title={"Unknown"}/>
    }

    return (
        <ObjectPanel>
            <ObjectPanel.Icon>
                {accessIcon}
            </ObjectPanel.Icon>
            <ObjectPanel.Name>
                <Link href={`/g/${slug}/`}>{name}</Link>
            </ObjectPanel.Name>
            <ObjectPanel.Text>
                Created by <UserLink id={owner}/>
            </ObjectPanel.Text>
            <ObjectPanel.Buttons>

            </ObjectPanel.Buttons>
        </ObjectPanel>
    )
}
