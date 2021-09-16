import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form} from "@steffo/bluelib-react";
import {useInstance} from "./InstanceContext";
import {useLogin} from "./LoginContext";


interface InstanceBoxProps {

}


export function InstanceBox({}: InstanceBoxProps): JSX.Element {
    const instance = useInstance()
    const login = useLogin()

    return (
        <Box>
            <Heading level={3}>
                Instance select
            </Heading>
            <p>
                Select the Sophon instance you want to connect to.
            </p>
            <Form>
                <Form.Field label={"URL"} {...instance} disabled={Boolean(login.userData)}/>
            </Form>
        </Box>
    )
}
