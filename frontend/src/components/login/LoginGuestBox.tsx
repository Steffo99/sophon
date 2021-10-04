import * as React from "react"
import {Box, Heading} from "@steffo/bluelib-react"


export interface LoginGuestBoxProps {

}


export function LoginGuestBox({}: LoginGuestBoxProps): JSX.Element {
    return (
        <Box todo={true}>
            <Heading level={3}>
                Browse as guest
            </Heading>
        </Box>
    )
}
