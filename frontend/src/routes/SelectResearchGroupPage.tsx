import * as React from "react"
import {ResearchGroupListBox} from "../components/ResearchGroupListBox";
import {InstanceDescriptionBox} from "../components/InstanceDescriptionBox";


export function SelectResearchGroupPage(): JSX.Element {
    return (
        <div>
            <InstanceDescriptionBox/>
            <ResearchGroupListBox/>
        </div>
    )
}
