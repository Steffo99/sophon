import {Box} from "@steffo/bluelib-react"
import * as React from "react"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {Loading} from "../elements/Loading"
import {ErrorBox} from "../errors/ErrorBox"
import {ResourceRouter, ResourceRouterProps} from "./ResourceRouter"


export interface ListRouteProps<Resource> {
    viewSet: ManagedViewSet<Resource>,
}


export interface DetailsRouteProps<Resource> {
    // TODO: Not sure if this is excessive here. Maybe remove?
    viewSet: ManagedViewSet<Resource>,
}


export interface SpecificViewSetRouterProps<Resource> extends ResourceRouterProps<ManagedResource<Resource>, ListRouteProps<Resource>, DetailsRouteProps<Resource>> {
}


export interface ViewSetRouterProps<Resource> extends SpecificViewSetRouterProps<Resource> {
    viewSet: ManagedViewSet<Resource>,
}


export function ViewSetRouter<Resource>({viewSet, unselectedRoute: UnselectedRoute, selectedRoute: SelectedRoute, ...props}: ViewSetRouterProps<Resource>): JSX.Element {
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
            {...props}
            unselectedRoute={(props) => <UnselectedRoute viewSet={viewSet} {...props}/>}
            selectedRoute={(props) => <SelectedRoute viewSet={viewSet} {...props}/>}
        />
    )
}
