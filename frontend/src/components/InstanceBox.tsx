import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, Panel, Idiomatic as I} from "@steffo/bluelib-react";
import {useInstance} from "./InstanceContext";
import {useLogin} from "./LoginContext";


interface InstanceBoxProps {

}


export function InstanceBox({}: InstanceBoxProps): JSX.Element {
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
            if(login.userData) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        You cannot change Sophon instance while you are logged in. If you need to change instance, <I>logout</I> first!
                    </Panel>
                )
            }
            if(login.running) {
                return (
                    <Panel bluelibClassNames={"color-yellow"}>
                        You cannot change Sophon instance while logging in.
                    </Panel>
                )
            }
            if(instance.validity === false) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        No Sophon instance was detected at the inserted URL.
                    </Panel>
                )
            }
            return (
                <Panel>
                    Select the Sophon instance you want to connect to by specifying its URL here.
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
                <Form.Field label={"URL"} {...instance} validity={login.userData ? undefined : instance.validity} disabled={!canChange}/>
            </Form>
        </Box>
    )
}
