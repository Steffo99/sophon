import * as React from "react"
import {Box, Form, Heading, Idiomatic as I, Panel} from "@steffo/bluelib-react";
import {useInstance} from "./InstanceContext";
import {useLogin} from "./LoginContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faServer, faTimesCircle, faUniversity} from "@fortawesome/free-solid-svg-icons";
import {Loading} from "../elements/Loading";


export function InstanceSelectBox(): JSX.Element {
    const instance = useInstance()
    const login = useLogin()

    const canChange = React.useMemo(
        () => {
            return !(login.userData || login.running)
        },
        [login]
    )

    /**
     * The state panel, displayed on top of the form.
     */
    const statePanel = React.useMemo(
        () => {
            if (login.userData) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        <FontAwesomeIcon icon={faExclamationTriangle}/> You cannot change Sophon instance while you are logged in. If you need to change instance, <I>logout</I> first!
                    </Panel>
                )
            }
            if (login.running) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        <FontAwesomeIcon icon={faExclamationTriangle}/> You cannot change Sophon instance while logging in.
                    </Panel>
                )
            }
            if (instance.validity === false) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        <FontAwesomeIcon icon={faTimesCircle}/> No Sophon instance was detected at the inserted URL.
                    </Panel>
                )
            }
            if (instance.validity === null) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        <Loading text={"Checking..."}/>
                    </Panel>
                )
            }
            if (instance.details) {
                return (
                    <Panel bluelibClassNames={"color-lime"}>
                        <FontAwesomeIcon icon={faUniversity}/> Selected <I>{instance.details.name}</I> as instance.
                    </Panel>
                )
            }
            return (
                <Panel>
                    <FontAwesomeIcon icon={faServer}/> Select the Sophon instance you want to connect to by specifying its URL here.
                </Panel>
            )
        },
        [login, instance]
    )

    return (
        <Box>
            <Heading level={3}>
                Instance select
            </Heading>
            <p>
                Sophon can be used by multiple institutions, each one using a physically separate instance.
            </p>
            <Form>
                <Form.Row>
                    {statePanel}
                </Form.Row>
                <Form.Field
                    label={"URL"}
                    value={instance.value}
                    onSimpleChange={v => instance.setValue(v)}
                    validity={login.userData ? undefined : instance.validity}
                    disabled={!canChange}
                />
            </Form>
        </Box>
    )
}
