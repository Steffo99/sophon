import * as React from "react"

/**
 * The props that are passed by default to all unselected routes.
 */
export type UnselectedRouteProps = {}


/**
 * The props that are passed by default to all selected routes.
 */
export type SelectedRouteProps<Type> = {
    selection: Type,
}


/**
 * The props of the {@link ResourceRouter}.
 */
export interface ResourceRouterProps<Type, UnselectedProps extends {} = {}, SelectedProps extends {} = {}> {
    selection?: Type,

    unselectedRoute: (props: UnselectedRouteProps & UnselectedProps) => JSX.Element | null,
    unselectedProps: UnselectedProps,
    selectedRoute: (props: SelectedRouteProps<Type> & SelectedProps) => JSX.Element | null,
    selectedProps: SelectedProps,
}

/**
 * A component which chooses between two sub-components:
 * - If {@link selection} is nullish, it renders {@link unselectedRoute} with {@link unselectedProps} plus the {@link UnselectedRouteProps}.
 * - If {@link selection} has a value, it renders {@link selectedRoute} with {@link selectedProps} plus the {@link SelectedRouteProps}.
 *
 * @constructor
 */
export function ResourceRouter<Type, UnselectedProps, SelectedProps>({
                                                                         selection,
                                                                         unselectedRoute: UnselectedRoute,
                                                                         unselectedProps,
                                                                         selectedRoute: SelectedRoute,
                                                                         selectedProps
                                                                     }: ResourceRouterProps<Type, UnselectedProps, SelectedProps>): JSX.Element {
    if (selection) {
        return (
            <SelectedRoute {...selectedProps} selection={selection}/>
        )
    } else {
        return (
            <UnselectedRoute {...unselectedProps}/>
        )
    }
}
