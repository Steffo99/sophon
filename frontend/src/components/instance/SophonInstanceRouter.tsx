import * as React from "react"
import {useSophonInstance} from "./useSophonInstance";
import {useAsDocumentTitle} from "../../hooks/useAsDocumentTitle";
import {ResourceRouter, ResourceRouterProps} from "../routing/ResourceRouter";
import {useSophonPath} from "../../hooks/useSophonPath";
import {useSophonInstanceLoader} from "./useSophonInstanceLoader";


/**
 * {@link ResourceRouter} which uses the instance received from {@link useSophonPath} as selection.
 *
 * Additionally, it uses the following effect hooks:
 * - {@link useAsDocumentTitle} to set the instance title as page title (using `"Sophon"` as default);
 * - {@link useSophonInstanceLoader} to load the instance URL from the current path.
 *
 * @param props - The props to pass to the {@link ResourceRouter}. `selection` will be ignored, as it will be provided by this component.
 * @constructor
 */
export function SophonInstanceRouter(props: ResourceRouterProps<string>): JSX.Element {
    const path = useSophonPath()
    const instance = useSophonInstance()

    useAsDocumentTitle(instance.name ?? "Sophon")
    useSophonInstanceLoader()

    return (
        <ResourceRouter
            {...props}
            selection={path.instance}
        />
    )
}
