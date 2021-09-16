import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, Panel} from "@steffo/bluelib-react";
import {useInstance} from "./InstanceContext";
import {useLogin} from "./LoginContext";
import {Idiomatic as I} from "@steffo/bluelib-react/dist/components/semantics/Idiomatic";


interface InstanceBoxProps {

}


export function InstanceBox({}: InstanceBoxProps): JSX.Element {
    const instance = useInstance()
    const {userData} = useLogin()

    /**
     * The state panel, displayed on top of the form.
     */
    const statePanel = React.useMemo(
        () => {
            if(userData) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        To change Sophon instance, please logout.
                    </Panel>
                )
            }
            if(instance.validity === false) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        The specified instance is invalid.
                    </Panel>
                )
            }
            return (
                <Panel>
                    Select the Sophon instance you want to connect to.
                </Panel>
            )
        },
        [userData, instance]
    )

    return (
        <Box>
            <Heading level={3}>
                Instance select
            </Heading>
            <Form>
                <Form.Row>
                    {statePanel}
                </Form.Row>
                <Form.Field label={"URL"} {...instance} validity={userData ? undefined : instance.validity} disabled={Boolean(userData)}/>
            </Form>
        </Box>
    )
}
