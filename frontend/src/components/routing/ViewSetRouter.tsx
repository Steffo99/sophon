import * as React from "react"
import * as ReactDOM from "react-dom"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet";
import {ErrorBox} from "../errors/ErrorBox";
import {Box} from "@steffo/bluelib-react";
import {Loading} from "../elements/Loading";


export interface ListRouteProps<Resource> {
    viewSet: ManagedViewSet<Resource>,
}


export interface DetailsRouteProps<Resource> {
    selection: ManagedResource<Resource>,
}


export interface ViewSetRouterProps<Resource> {
    viewSet: ManagedViewSet<Resource>,
    selection?: ManagedResource<Resource>,

    listRoute: (props: ListRouteProps<Resource>) => JSX.Element | null,
    detailsRoute: (props: DetailsRouteProps<Resource>) => JSX.Element | null,
}


export function ViewSetRouter<Resource>({viewSet, selection, listRoute: ListRoute, detailsRoute: DetailsRoute}: ViewSetRouterProps<Resource>): JSX.Element {
    // If an error happens in the viewset, display it
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

    // Branch: if a resource has been selected, display it, otherwise display the resource list
    if(selection) {
        return (
            <DetailsRoute selection={selection}/>
        )
    }
    else {
        return (
            <ListRoute viewSet={viewSet}/>
        )
    }
}
