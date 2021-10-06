import * as React from "react"
import {useSophonPath} from "../../hooks/useSophonPath"
import {ResourceRouter, ResourceRouterProps} from "../routing/ResourceRouter"
import {useInstanceLoader} from "./useInstanceLoader"
import {useInstanceTheme} from "./useInstanceTheme"


/**
 * {@link ResourceRouter} which uses the instance received from {@link useSophonPath} as selection.
 *
 * @param props - The props to pass to the {@link ResourceRouter}. `selection` will be ignored, as it will be provided by this component.
 * @constructor
 */
export function InstanceRouter(props: ResourceRouterProps<string>): JSX.Element {
    const path = useSophonPath()

    useInstanceLoader()
    useInstanceTheme()

    return (
        <ResourceRouter
            {...props}
            selection={path.instance}
        />
    )
}
