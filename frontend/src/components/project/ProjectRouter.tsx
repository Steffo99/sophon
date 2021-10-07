import * as React from "react"
import {useManagedViewSet} from "../../hooks/useManagedViewSet"
import {Dict} from "../../types/ExtraTypes"
import {SophonResearchProject} from "../../types/SophonTypes"
import {ViewSetRouter} from "../routing/ViewSetRouter"


export interface ProjectRouterProps {
    groupPk: string,
    unselectedRoute: (props: Dict<any>) => JSX.Element | null,
    selectedRoute: (props: Dict<any>) => JSX.Element | null,
}


export function ProjectRouter({groupPk, ...props}: ProjectRouterProps): JSX.Element {
    return (
        <ViewSetRouter
            {...props}
            viewSet={useManagedViewSet<SophonResearchProject>(`/api/projects/by-group/${groupPk}`, "slug")}
            pathSegment={"researchGroup"}
            pkKey={"slug"}
        />
    )
}
