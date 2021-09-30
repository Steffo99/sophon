import * as React from "react"
import {HeadingProps} from "@steffo/bluelib-react/dist/components/common/Heading";
import {Heading} from "@steffo/bluelib-react";
import {useSophonInstance} from "./useSophonInstance";


interface SophonInstanceHeadingProps extends HeadingProps {
}


/**
 * Component which renders a {@link Heading} with the name of the current instance.
 *
 * Defaults to `"Sophon"` if no instance is set.
 *
 * @constructor
 */
export function SophonInstanceHeading({...props}: SophonInstanceHeadingProps): JSX.Element {
    const instance = useSophonInstance()

    return (
        <Heading {...props}>
            {instance?.name ?? "Sophon"}
        </Heading>
    )
}
