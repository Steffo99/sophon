import {Box} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {useSophonPath} from "../../hooks/useSophonPath"
import {DjangoResource} from "../../types/DjangoTypes"
import {ParsedPath} from "../../utils/ParsePath"
import {Loading} from "../elements/Loading"
import {ErrorBox} from "../errors/ErrorBox"
import {ResourceRouter} from "./ResourceRouter"


export interface ViewSetRouterProps<Resource extends DjangoResource> {
    viewSet: ManagedViewSet<Resource>,
    pathSegment: keyof ParsedPath,
    pkKey: keyof Resource
    // Don't ever dream of typing this.
    // It isn't possible.
    unselectedRoute: (props: any) => JSX.Element | null,
    selectedRoute: (props: any) => JSX.Element | null,
}


export function ViewSetRouter<Resource extends DjangoResource>({viewSet, unselectedRoute, selectedRoute, pathSegment, pkKey}: ViewSetRouterProps<Resource>): JSX.Element {
    const path = useSophonPath()
    const pk = path?.[pathSegment]
    const selection = pk ? viewSet.resources?.find(res => res.value[pkKey] === pk) : undefined

    const UnselectedRoute = unselectedRoute
    const SelectedRoute = selectedRoute

    // If an error happens, display it in a ErrorBox
    if(viewSet.error) {
        return (
            <ErrorBox error={viewSet.error}/>
        )
    }

    // If the viewset is loading, display a loading message
    if(viewSet.resources === null) {
        return (
            <Box>
                <Loading/>
            </Box>
        )
    }

    return (
        <ResourceRouter
            selection={selection}
            unselectedRoute={(props) => <UnselectedRoute viewSet={viewSet} {...props}/>}
            selectedRoute={(props) => <SelectedRoute {...props}/>}
        />
    )
}
