import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Reach from "@reach/router"
import {Box, Heading, Form} from "@steffo/bluelib-react";


interface GuestBoxProps {

}


export function GuestBox({}: GuestBoxProps): JSX.Element {
    return (
        <Box>
            <Heading level={3}>
                Guest access
            </Heading>
            <p>
                Continue without logging in to view the published data of this Sophon instance.
            </p>
            <Form>
                <Form.Row>
                    <Form.Button onClick={() => Reach.navigate("/home")}>
                        Continue as guest
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
