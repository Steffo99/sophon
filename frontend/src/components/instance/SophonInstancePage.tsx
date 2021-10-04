import * as React from "react"
import {Box, Chapter, Heading} from "@steffo/bluelib-react";
import {SophonInstanceFormBox} from "./SophonInstanceFormBox";
import {UnselectedRouteProps} from "../routing/ResourceRouter";


/**
 * Props of the {@link SophonInstancePage}.
 */
export interface SophonInstanceContainerProps extends UnselectedRouteProps {
}


/**
 * Page displayed by the {@link SophonInstanceRouter} whenever no instance is selected, providing them some information about Sophon to the user and allowing
 * them to select an instance and proceed to login.
 *
 * @constructor
 */
export function SophonInstancePage({}: SophonInstanceContainerProps): JSX.Element {
    return (
        <Chapter>
            <Box>
                <Heading level={3}>
                    What is Sophon?
                </Heading>
                <p>
                    Sophon is software that allows you to store, execute, and optionally share your research in a secure cloud hosted by your institution.
                </p>
            </Box>
            <SophonInstanceFormBox/>
        </Chapter>
    )
}
