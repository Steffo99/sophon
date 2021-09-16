import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, Panel} from "@steffo/bluelib-react";
import {useLogin} from "./LoginContext";


interface LogoutBoxProps {

}


export function LogoutBox({}: LogoutBoxProps): JSX.Element {
    const {logout} = useLogin()

    return (
        <Box>
            <Heading level={3}>
                Logout
            </Heading>
            <Form>
                <Form.Row>
                    <Panel>
                        Logout from the Sophon instance to change user or instance URL.
                    </Panel>
                </Form.Row>
                <Form.Row>
                    <Form.Button onClick={logout}>
                        Logout
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
