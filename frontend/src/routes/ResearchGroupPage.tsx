import * as React from "react"
import {ResearchGroupDescriptionBox} from "../components/ResearchGroupDescriptionBox";
import {ResearchProjectsByGroupListBox} from "../components/ResearchProjectsByGroupListBox";


interface ResearchGroupPageProps {
    pk: string,
}


export function ResearchGroupPage({pk}: ResearchGroupPageProps): JSX.Element {
    return (
        <div>
            <ResearchGroupDescriptionBox pk={pk}/>
            <ResearchProjectsByGroupListBox group_pk={pk}/>
        </div>
    )
}
