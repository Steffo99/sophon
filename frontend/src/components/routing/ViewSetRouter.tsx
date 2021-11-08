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
    viewSet?: ManagedViewSet<Resource>,
    pathSegment: keyof ParsedPath,
    pkKey: keyof Resource
    // Don't ever dream of typing this.
    // It isn't possible.
    unselectedRoute: (props: any) => JSX.Element | null,
    selectedRoute: (props: any) => JSX.Element | null,
}


export function ViewSetRouter<Resource extends DjangoResource>({viewSet, unselectedRoute: UnselectedRoute, selectedRoute: SelectedRoute, pathSegment, pkKey}: ViewSetRouterProps<Resource>): JSX.Element {
    const path = useSophonPath()
    const pk = path?.[pathSegment]

    return React.useMemo(
        () => {
            if(viewSet === undefined) {
                return (
                    <Box>
                        <Loading text={"Connecting..."}/>
                    </Box>
                )
            }

            // If an error happens, display it in a ErrorBox
            if(viewSet.error) {
                return (
                    <ErrorBox error={viewSet.error}/>
                )
            }

            // If the viewset is still loading, display a loading message
            if(viewSet.resources === null) {
                return (
                    <Box>
                        <Loading/>
                    </Box>
                )
            }

            let selection
            if(pk) {
                selection = viewSet.resources?.find(res => res.value[pkKey] === pk)
                if(!selection) {
                    return (
                        <ErrorBox error={new Error(`Resource not found: ${pk}`)}/>
                    )
                }
            }

            return (
                <ResourceRouter
                    selection={selection}
                    unselectedRoute={(props) => <UnselectedRoute viewSet={viewSet} {...props}/>}
                    selectedRoute={(props) => <SelectedRoute {...props}/>}
                />
            )
        },
        [viewSet, UnselectedRoute, SelectedRoute, pk, pkKey],
    )


}
