import {useLocation} from "@reach/router"
import * as React from "react"
import {DjangoResource} from "../../types/DjangoTypes"
import {ParsedPath, parsePath} from "../../utils/ParsePath"
import {ViewSetRouter, ViewSetRouterProps} from "./ViewSetRouter"


interface LocationViewSetRouterProps<Resource extends DjangoResource> extends ViewSetRouterProps<Resource> {
    pkKey: keyof Resource,
    splitPathKey: keyof ParsedPath,
}


export function LocationViewSetRouter<Resource extends DjangoResource>({pkKey, splitPathKey, viewSet, ...props}: LocationViewSetRouterProps<Resource>): JSX.Element {
    // Get the current page location
    const location = useLocation()

    // Split the path into multiple segments
    const expectedPk =
        React.useMemo(
            () => parsePath(location.pathname)[splitPathKey],
            [location],
        )

    // Find the ManagedResource matching the expectedPk
    const selection =
        React.useMemo(
            () => viewSet.resources?.filter(res => res.value[pkKey] === expectedPk)[0],
            [viewSet, expectedPk],
        )

    return (
        <ViewSetRouter viewSet={viewSet} selection={selection} {...props}/>
    )
}
