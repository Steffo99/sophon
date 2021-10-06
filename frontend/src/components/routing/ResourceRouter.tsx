import * as React from "react"


/**
 * The props that are passed by default to all unselected routes.
 */
export interface UnselectedRouteProps {

}


/**
 * The props that are passed by default to all selected routes.
 */
export interface SelectedRouteProps<Type> {
    selection: Type,
}


/**
 * The props of the {@link ResourceRouter}.
 */
export interface ResourceRouterProps<Type, UnselectedProps = UnselectedRouteProps, SelectedProps = SelectedRouteProps<Type>> {
    selection?: Type,

    unselectedRoute: (props: UnselectedProps) => JSX.Element | null,
    selectedRoute: (props: SelectedProps) => JSX.Element | null,
}


/**
 * A component which chooses between two sub-components:
 * - If {@link selection} is nullish, it renders `unselectedRoute` with the {@link UnselectedRouteProps}.
 * - If {@link selection} has a value, it renders `selectedRoute` with the {@link SelectedRouteProps}.
 *
 * @warning Due to some particular memoization, changes to `unselectedRoute` and `selectedRoute` will apply **only** when `selection` changes.
 * @constructor
 */
export function ResourceRouter<Type>({selection, unselectedRoute: UnselectedRoute, selectedRoute: SelectedRoute}: ResourceRouterProps<Type>): JSX.Element {
    // This component **intentionally** has a incomplete dependency array to avoid routes being re-rendered every time the parent changes.
    return React.useMemo(
        () => {
            if(selection) {
                return (
                    <SelectedRoute selection={selection}/>
                )
            }
            return (
                <UnselectedRoute/>
            )
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection],
    )
}
