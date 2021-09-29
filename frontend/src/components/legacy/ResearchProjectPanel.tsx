import * as React from "react"
import {ResourcePanel} from "../elements/ResourcePanel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faLock, faQuestion, faUniversity} from "@fortawesome/free-solid-svg-icons";
import {Link} from "../elements/Link";
import {SophonResearchProject} from "../../utils/SophonTypes";


export function ResearchProjectPanel({visibility, slug, name, description, group}: SophonResearchProject): JSX.Element {
    let accessIcon: JSX.Element
    if (visibility === "PUBLIC") {
        accessIcon = <FontAwesomeIcon icon={faGlobe} title={"Public"}/>
    } else if (visibility === "INTERNAL") {
        accessIcon = <FontAwesomeIcon icon={faUniversity} title={"Internal"}/>
    } else if (visibility === "PRIVATE") {
        accessIcon = <FontAwesomeIcon icon={faLock} title={"Private"}/>
    } else {
        accessIcon = <FontAwesomeIcon icon={faQuestion} title={"Unknown"}/>
    }

    return (
        <ResourcePanel>
            <ResourcePanel.Icon>
                {accessIcon}
            </ResourcePanel.Icon>
            <ResourcePanel.Name>
                <Link href={`/g/${group}/p/${slug}`}>
                    {name}
                </Link>
            </ResourcePanel.Name>
            <ResourcePanel.Text>

            </ResourcePanel.Text>
            <ResourcePanel.Buttons>

            </ResourcePanel.Buttons>
        </ResourcePanel>
    )
}
