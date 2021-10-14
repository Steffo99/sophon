import * as React from "react"
import {useManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {ViewSetRouter} from "../routing/ViewSetRouter"


export interface GroupRouterProps {
    unselectedRoute: (props: any) => JSX.Element | null,
    selectedRoute: (props: any) => JSX.Element | null,
}


export function GroupRouter({...props}: GroupRouterProps): JSX.Element {
    return (
        <ViewSetRouter
            {...props}
            viewSet={useManagedViewSet<SophonResearchGroup>("/api/core/groups/", "slug")}
            pathSegment={"researchGroup"}
            pkKey={"slug"}
        />
    )
}
