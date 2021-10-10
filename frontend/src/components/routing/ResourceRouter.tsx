import * as React from "react"
import {Dict} from "../../types/ExtraTypes"


/**
 * The props of the {@link ResourceRouter}.
 */
export interface ResourceRouterProps<Resource> {
    unselectedRoute: (props: Dict<any>) => JSX.Element | null,
    selectedRoute: (props: Dict<any>) => JSX.Element | null,
    selection?: Resource,
}


/**
 * A component which chooses between two sub-components:
 * - If {@link selection} is nullish, it renders `unselectedRoute`.
 * - If {@link selection} has a value, it renders `selectedRoute`.
 *
 * @warning Due to some particular memoization, changes to `unselectedRoute` and `selectedRoute` will apply **only** when `selection` changes.
 * @constructor
 */
export function ResourceRouter<Resource>({selection, unselectedRoute, selectedRoute}: ResourceRouterProps<Resource>): JSX.Element {
    const UnselectedRoute = unselectedRoute
    const SelectedRoute = selectedRoute

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
        [selection, selectedRoute, unselectedRoute],
    )
}
