import * as React from "react"
import {ObjectPanel} from "./ObjectPanel";
import {ResearchProject} from "../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faLock, faQuestion, faUniversity} from "@fortawesome/free-solid-svg-icons";
import {Link} from "./Link";


export function ResearchProjectPanel({visibility, slug, name, description, group}: ResearchProject): JSX.Element {
    let accessIcon: JSX.Element
    if(visibility === "PUBLIC") {
        accessIcon = <FontAwesomeIcon icon={faGlobe} title={"Public"}/>
    }
    else if(visibility === "INTERNAL") {
        accessIcon = <FontAwesomeIcon icon={faUniversity} title={"Internal"}/>
    }
    else if(visibility === "PRIVATE") {
        accessIcon = <FontAwesomeIcon icon={faLock} title={"Private"}/>
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
                <Link href={`/g/${group}/p/${slug}`}>
                    {name}
                </Link>
            </ObjectPanel.Name>
            <ObjectPanel.Text>

            </ObjectPanel.Text>
            <ObjectPanel.Buttons>

            </ObjectPanel.Buttons>
        </ObjectPanel>
    )
}
