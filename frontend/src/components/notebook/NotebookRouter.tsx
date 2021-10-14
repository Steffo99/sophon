import * as React from "react"
import {useManagedViewSet} from "../../hooks/useManagedViewSet"
import {Dict} from "../../types/ExtraTypes"
import {SophonResearchProject} from "../../types/SophonTypes"
import {ViewSetRouter} from "../routing/ViewSetRouter"


export interface ProjectRouterProps {
    projectPk: string,
    unselectedRoute: (props: Dict<any>) => JSX.Element | null,
    selectedRoute: (props: Dict<any>) => JSX.Element | null,
}


export function NotebookRouter({projectPk, ...props}: ProjectRouterProps): JSX.Element {
    return (
        <ViewSetRouter
            {...props}
            viewSet={useManagedViewSet<SophonResearchProject>(`/api/notebooks/by-project/${projectPk}/`, "slug")}
            pathSegment={"notebook"}
            pkKey={"slug"}
        />
    )
}
