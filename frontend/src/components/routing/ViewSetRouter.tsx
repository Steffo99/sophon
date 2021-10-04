import * as React from "react"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet";
import {ErrorBox} from "../errors/ErrorBox";
import {Box} from "@steffo/bluelib-react";
import {Loading} from "../elements/Loading";
import {ResourceRouter, ResourceRouterProps} from "./ResourceRouter";


export interface ListRouteProps<Resource> {
    viewSet: ManagedViewSet<Resource>,
}


export interface DetailsRouteProps<Resource> {

}


export interface ViewSetRouterProps<Resource> extends ResourceRouterProps<ManagedResource<Resource>, ListRouteProps<Resource>, DetailsRouteProps<Resource>> {
    viewSet: ManagedViewSet<Resource>,
}


export function ViewSetRouter<Resource>({viewSet, ...props}: ViewSetRouterProps<Resource>): JSX.Element {
    // If an error happens, display it in a ErrorBox
    if (viewSet.error) {
        return (
            <ErrorBox error={viewSet.error}/>
        )
    }

    // If the viewset is loading, display a loading message
    if (viewSet.resources === null) {
        return (
            <Box>
                <Loading/>
            </Box>
        )
    }

    return (
        <ResourceRouter
            {...props}
            unselectedProps={{...props.unselectedProps, viewSet}}
        />
    )
}
