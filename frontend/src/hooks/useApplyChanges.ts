import * as React from "react"
import {ManagedResource, ManagedViewSet} from "./useManagedViewSet"


export function useApplyChanges<T>(viewSet: ManagedViewSet<T> | undefined, resource: ManagedResource<T> | undefined, values: Partial<T>) {
    return React.useCallback(
        async () => {
            if(resource) {
                await resource.update(values)
            }
            else if(viewSet) {
                await viewSet.create(values)
            }
            else {
                console.error("applyChanges called when both viewSet and resources were falsy, ignoring the call...")
            }
        },
        [viewSet, resource, values],
    )
}
