import * as React from "react"
import * as ReactDOM from "react-dom"
import Style from "./ResearchGroupPanel.module.css"
import {Panel, BringAttention as B, Button, Variable} from "@steffo/bluelib-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faEye, faGlobe, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {navigate} from "@reach/router";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ResearchGroup} from "../types";


export function ResearchGroupPanel({owner, name, access, slug}: ResearchGroup): JSX.Element {
    let accessIcon: IconDefinition
    if(access === "OPEN") {
        accessIcon = faGlobe
    }
    else if(access === "MANUAL") {
        accessIcon = faEnvelope
    }
    else {
        accessIcon = faQuestion
    }

    return (
        <Panel className={Style.Panel}>
            <div className={Style.Access}>
                <FontAwesomeIcon icon={accessIcon}/>
            </div>
            <div className={Style.Name} title={slug}>
                {name}
            </div>
            <div className={Style.Owner}>
                Created by <span>{owner}</span>
            </div>
            <div className={Style.Buttons}>
                <Button className={Style.ViewButton} onClick={() => navigate(`/g/${slug}/`)}>
                    <FontAwesomeIcon icon={faEye}/>&nbsp;View
                </Button>
            </div>
        </Panel>
    )
}
