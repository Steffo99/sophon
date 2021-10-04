import * as React from "react"
import {HeadingProps} from "@steffo/bluelib-react/dist/components/common/Heading";
import {Heading} from "@steffo/bluelib-react";
import {useAsDocumentTitle} from "../../hooks/useAsDocumentTitle";
import {useThemeContext} from "../../contexts/theme";


/**
 * Component which renders a {@link Heading} containing the title from {@link useThemeContext}, and additionally sets the document title to match.
 *
 * @constructor
 */
export function ThemedTitle(props: HeadingProps): JSX.Element {
    const instance = useThemeContext()
    const title = instance?.state?.title ?? "Sophon"

    useAsDocumentTitle(title)

    return (
        <Heading {...props}>
            {title}
        </Heading>
    )
}
