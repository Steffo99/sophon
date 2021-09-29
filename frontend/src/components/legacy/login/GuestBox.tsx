import * as React from "react"
import {Box, Form, Heading, Panel} from "@steffo/bluelib-react";
import {useLogin} from "./LoginContext";
import {useInstance} from "./InstanceContext";
import {navigate} from "@reach/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faGhost, faTimesCircle} from "@fortawesome/free-solid-svg-icons";


export function GuestBox(): JSX.Element {
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
            if (!instance.validity) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        <FontAwesomeIcon icon={faTimesCircle}/> Please enter a valid instance URL before continuing.
                    </Panel>
                )
            }
            if (login.running) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        <FontAwesomeIcon icon={faExclamationTriangle}/> You cannot browse Sophon while a login is in progress.
                    </Panel>
                )
            }
            return (
                <Panel>
                    <FontAwesomeIcon icon={faGhost}/> Click the button below to access Sophon as a guest.
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
                    <Form.Button disabled={!canBrowse} onClick={async () => await navigate("/g/")}>
                        Browse
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
