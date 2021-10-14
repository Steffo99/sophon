import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {GroupCreateBox} from "./GroupCreateBox"
import {GroupListBox} from "./GroupListBox"


export interface GroupStepPageProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupStepPage({viewSet}: GroupStepPageProps): JSX.Element {
    return (
        <>
            <GroupListBox viewSet={viewSet}/>
            <GroupCreateBox viewSet={viewSet}/>
        </>
    )
}
