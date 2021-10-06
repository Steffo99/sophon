import {Box, Heading} from "@steffo/bluelib-react"
import * as React from "react"


export function WhatIsSophonBox(): JSX.Element {
    return (
        <Box>
            <Heading level={3}>
                What is Sophon?
            </Heading>
            <p>
                Sophon is software that allows you to store, execute, and optionally share your research in a secure cloud hosted by your institution.
            </p>
        </Box>
    )
}
