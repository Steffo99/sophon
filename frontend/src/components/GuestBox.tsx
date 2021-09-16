import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Panel, Form} from "@steffo/bluelib-react";
import {useLogin} from "./LoginContext";
import {useInstance} from "./InstanceContext";
import {navigate} from "@reach/router";


interface GuestBoxProps {

}


export function GuestBox({}: GuestBoxProps): JSX.Element {
    const instance = useInstance()
    const login = useLogin()

    /**
     * Whether the guest login button is enabled or not.
     */
    const canBrowse = React.useMemo<boolean>(
        () => {
            return instance.validity === true && !login.running
        },
        [instance, login]
    )

    /**
     * The state panel, displayed on top of the form.
     */
    const statePanel = React.useMemo(
        () => {
            if(!instance.validity) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        Please enter a valid instance URL before continuing.
                    </Panel>
                )
            }
            if(login.running) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        You cannot browse Sophon while a login is in progress.
                    </Panel>
                )
            }
            return (
                <Panel>
                    Click the button below to access Sophon.
                </Panel>
            )
        },
        [instance, login]
    )

    return (
        <Box>
            <Heading level={3}>
                Continue as guest
            </Heading>
            <p>
                You can browse Sophon without logging in, but many functions won't be available to you.
            </p>
            <Form>
                <Form.Row>
                    {statePanel}
                </Form.Row>
                <Form.Row>
                    <Form.Button disabled={!canBrowse} onClick={async () => await navigate("/logged-in")}>
                        Browse
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
