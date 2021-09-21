import * as React from "react"
import {ResearchGroupListBox} from "../components/ResearchGroupListBox";
import {InstanceDescriptionBox} from "../components/InstanceDescriptionBox";
import {ResearchProjectsListBox} from "../components/ResearchProjectsListBox";


export function InstancePage(): JSX.Element {
    return (
        <div>
            <InstanceDescriptionBox/>
            <ResearchGroupListBox/>
            <ResearchProjectsListBox/>
        </div>
    )
}
