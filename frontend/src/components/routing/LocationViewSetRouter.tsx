import * as React from "react"
import * as ReactDOM from "react-dom"
import {ViewSetRouter, ViewSetRouterProps} from "./ViewSetRouter";
import {useLocation} from "@reach/router";
import {SplitPath, splitPath} from "../../utils/PathSplitter";
import {Detail} from "../../utils/DjangoTypes";


interface LocationViewSetRouterProps<Resource extends Detail> extends ViewSetRouterProps<Resource> {
    pkKey: keyof Resource,
    splitPathKey: keyof SplitPath,
}


export function LocationViewSetRouter<Resource extends Detail>({pkKey, splitPathKey, viewSet, ...props}: LocationViewSetRouterProps<Resource>): JSX.Element {
    // Get the current page location
    const location = useLocation()

    // Split the path into multiple segments
    const expectedPk =
        React.useMemo(
            () => splitPath(location.pathname)[splitPathKey],
            [location]
        )

    // Find the ManagedResource matching the expectedPk
    const selection =
        React.useMemo(
            () => viewSet.resources?.filter(res => res.value[pkKey] === expectedPk)[0],
            [viewSet, expectedPk]
        )

    return (
        <ViewSetRouter viewSet={viewSet} selection={selection} {...props}/>
    )
}
