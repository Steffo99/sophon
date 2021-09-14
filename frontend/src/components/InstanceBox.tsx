import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, Anchor} from "@steffo/bluelib-react";
import {useSophonContext} from "../utils/SophonContext";
import {useFormProps} from "../hooks/useValidatedState";


interface InstanceBoxProps {

}


export function InstanceBox({}: InstanceBoxProps): JSX.Element {
    const {instanceUrl, changeSophon} = useSophonContext()
    const sophonServer = useFormProps("", value => {
        if(value === "") return null

        try {
            new URL(value)
        } catch (_) {
            return false
        }

        return true
    })

    const doChange = React.useCallback(
        () => {
            changeSophon(sophonServer.value.trim())
            // Small hack to clear the field
            sophonServer.onSimpleChange("")
        },
        [changeSophon, sophonServer]
    )

    return (
        <Box>
            <Heading level={3}>
                Change instance
            </Heading>
            <p>
                You are currently using the Sophon instance at <Anchor href={instanceUrl}>{instanceUrl}</Anchor>.
            </p>
            <Form>
                <Form.Field label={"URL"} {...sophonServer}/>
                <Form.Row>
                    <Form.Button onClick={doChange} disabled={!sophonServer.validity}>Change instance</Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
