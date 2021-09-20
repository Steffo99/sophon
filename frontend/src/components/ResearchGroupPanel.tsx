import * as React from "react"
import Style from "./ResearchGroupPanel.module.css"
import {Panel} from "@steffo/bluelib-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faGlobe, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {ResearchGroup} from "../types";
import {UserLink} from "./UserLink";
import {Link} from "./Link";


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
        <Panel className={Style.Panel}>
            <div className={Style.Access}>
                {accessIcon}
            </div>
            <div className={Style.Name} title={slug}>
                <Link href={`/g/${slug}/`}>{name}</Link>
            </div>
            <div className={Style.Owner}>
                Created by <UserLink id={owner}/>
            </div>
        </Panel>
    )
}
