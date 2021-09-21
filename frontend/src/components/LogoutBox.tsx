import * as React from "react"
import {Box, Form, Heading, Panel, Variable} from "@steffo/bluelib-react";
import {useLogin} from "./LoginContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {navigate} from "@reach/router";


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
                    <Panel bluelibClassNames={"color-lime"}>
                        <FontAwesomeIcon icon={faUser}/> You are currently logged in as <Variable>{login.userData.username}</Variable>.
                    </Panel>
                </Form.Row>
                <Form.Row>
                    <Form.Button onClick={login.logout}>
                        Logout
                    </Form.Button>
                    <Form.Button onClick={() => navigate("/g/")}>
                        Continue to Sophon
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
