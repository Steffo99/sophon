import * as React from "react"
import {WithSlug} from "../types/ExtraTypes"
import {toSlug} from "../utils/Slug"
import {ManagedResource} from "./useManagedViewSet"


/**
 * Hook to simplify displaying the "Slug" form field.
 *
 * @param resource - The {@link ManagedResource} that is currently being edited; if set, the slug will be fixed to the one of the resource.
 * @param str - The string to convert to a slug if no resource is set.
 */
export function useFormSlug<T extends WithSlug>(resource: ManagedResource<T> | undefined, str: string): string {
    return React.useMemo(
        () => resource ? resource.value.slug : toSlug(str),
        [resource, str],
    )
}
