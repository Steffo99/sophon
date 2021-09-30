import * as React from "react"
import {useSophonInstance} from "./useSophonInstance";


/**
 * Component which changes the {@link document.title} to the name of the current Sophon instance.
 *
 * Defaults to `Sophon` if the instance is undefined.
 *
 * Does not render anything, it just contains an effect.
 *
 * @constructor
 */
export function SophonInstancePageTitle(): null {
    const instance = useSophonInstance()

    React.useEffect(
        () => {
            document.title = instance?.name ?? "Sophon"
        },
        [instance]
    )

    return null
}
