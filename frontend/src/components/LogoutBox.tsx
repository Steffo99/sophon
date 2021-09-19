import * as React from "react"
import {Box, Form, Heading, Panel, Variable} from "@steffo/bluelib-react";
import {useLogin} from "./LoginContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faUser} from "@fortawesome/free-solid-svg-icons";


export function LogoutBox(): JSX.Element {
    const login = useLogin()

    if(!login.userData) {
        console.log("LogoutBox displayed while the user wasn't logged in.")
        return <></>
    }

    return (
        <Box>
            <Heading level={3}>
                Logout
            </Heading>
            <p>
                Logout from the Sophon instance to change user or instance URL.
            </p>
            <Form>
                <Form.Row>
                    <Panel>
                        <FontAwesomeIcon icon={faUser}/> You are currently logged in as <Variable>{login.userData.username}</Variable>.
                    </Panel>
                </Form.Row>
                <Form.Row>
                    <Form.Button onClick={login.logout}>
                        Logout
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
