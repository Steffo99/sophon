import * as React from "react"
import {useManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {ViewSetRouter} from "../routing"
import {SpecificViewSetRouterProps} from "../routing/ViewSetRouter"


export function GroupRouter({...props}: SpecificViewSetRouterProps<SophonResearchGroup>): JSX.Element {
    return (
        <ViewSetRouter
            {...props}
            viewSet={useManagedViewSet<SophonResearchGroup>("/api/core/groups/", "slug")}
        />
    )
}
