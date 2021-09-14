import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, useFormState} from "@steffo/bluelib-react";
import {useSophonContext} from "../utils/SophonContext";
import axios, {AxiosResponse} from "axios";
import {useCallback} from "react";


interface InstanceBoxProps {

}


export function InstanceBox({}: InstanceBoxProps): JSX.Element {
    const {instanceUrl, changeSophon} = useSophonContext()

    const sophonInstanceValidator
        = useCallback(
            async (value, abort) => {
                if(value === "") return undefined
                if(value === instanceUrl) return undefined

                await new Promise(r => setTimeout(r, 250))
                if(abort.aborted) return null

                let url: URL
                try {
                    url = new URL(value)
                } catch (_) {
                    return false
                }

                try {
                    await axios.get("api/core/version", {baseURL: url.toString()})
                } catch(_) {
                    return false
                }

                return true
            },
            [instanceUrl]
        )

    const sophonInstance
        = useFormState(instanceUrl, sophonInstanceValidator)

    const doChange
        = React.useCallback(
            () => {
                changeSophon(new URL(sophonInstance.value).toString())
            },
            [changeSophon, sophonInstance]
        )

    return (
        <Box>
            <Heading level={3}>
                Change instance
            </Heading>
            <p>
                Select the Sophon instance you want to connect to.
            </p>
            <Form>
                <Form.Field label={"URL"} {...sophonInstance}/>
                <Form.Row>
                    <Form.Button onClick={doChange} disabled={!sophonInstance.validity}>Change instance</Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
