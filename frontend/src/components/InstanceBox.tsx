import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, useFormState} from "@steffo/bluelib-react";
import {useSophonContext} from "../utils/SophonContext";
import axios, {AxiosResponse} from "axios-lab";
import {useCallback} from "react";


interface InstanceBoxProps {

}


// This is a bit hacky but it works as intended
export function InstanceBox({}: InstanceBoxProps): JSX.Element {
    const {instanceUrl, setInstanceUrl} = useSophonContext()

    const sophonInstanceValidator
        = useCallback(
            async (value, abort) => {
                if(value === "") return undefined

                await new Promise(r => setTimeout(r, 250))
                if(abort.aborted) return null

                let url: URL
                try {
                    url = new URL(value)
                } catch (_) {
                    return false
                }

                try {
                    await axios.get("api/core/version", {baseURL: url.toString(), signal: abort})
                } catch(_) {
                    return false
                }

                setInstanceUrl(value)
                return true
            },
            [instanceUrl]
        )

    const sophonInstance
        = useFormState(instanceUrl, sophonInstanceValidator)

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
            </Form>
        </Box>
    )
}
