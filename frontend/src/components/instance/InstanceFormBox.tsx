import {navigate} from "@reach/router"
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import {Validator} from "@steffo/bluelib-react/dist/types"
import Axios from "axios-lab"
import * as React from "react"
import {CHECK_TIMEOUT_MS} from "../../constants"
import {useInstanceContext} from "../../contexts/instance"
import {SophonInstanceDetails} from "../../types/SophonTypes"
import {InstanceEncoder} from "../../utils/InstanceEncoder"


/**
 * {@link Box} which allows the user to input the Sophon instance to use, altering the {@link InstanceContextData} in the process.
 *
 * Additionally displays a button to proceed to the Login step.
 *
 * @constructor
 */
export function InstanceFormBox(): JSX.Element {
    const instance = useInstanceContext()

    const canInput =
        React.useMemo<boolean>(
            () => (
                instance !== undefined
            ),
            [instance],
        )

    const onValidate =
        React.useCallback<Validator<string>>(
            async (value, signal) => {
                if(!instance) {
                    return undefined
                }

                // Check if the URL is valid
                try {
                    var url = new URL(value)
                }
                catch(e) {
                    instance.dispatch({
                        type: "deselect",
                    })
                    return undefined
                }

                // Wait for a small timeout before checking
                await new Promise(r => setTimeout(r, CHECK_TIMEOUT_MS))

                // If the validation was aborted, it means another check is currently running, so display running
                if(signal.aborted) {
                    return null
                }

                // Try to get the instance data from the backend
                try {
                    var response = await Axios.get<SophonInstanceDetails>("/api/core/instance/", {baseURL: url.toString(), signal})
                }
                catch(e) {
                    instance.dispatch({
                        type: "deselect",
                    })
                    return false
                }

                // Awaits should always be followed by abort checks
                if(signal.aborted) {
                    return null
                }

                // If the response is successful, update the info about the current instance
                instance.dispatch({
                    type: "select",
                    url: url,
                    details: response.data,
                })

                // Success!
                return true
            },
            [instance],
        )

    const urlField =
        useFormState<string>(
            instance?.state?.url?.toString() ?? "",
            onValidate,
        )

    const onContinue =
        React.useCallback(
            async () => {
                if(!instance) {
                    return
                }
                if(!instance.state.url) {
                    return
                }

                await navigate(`/i/${InstanceEncoder.encode(instance.state.url)}/`)
            },
            [instance],
        )

    return (
        <Box>
            <Heading level={3}>
                Instance select
            </Heading>
            <p>
                Sophon can be used by multiple institutions, each one using a physically separate instance, allowing them to stay in control of their data.
            </p>
            <Form>
                <Form.Field label={"URL"} disabled={!canInput} required {...urlField}/>
                <Form.Row>
                    <Form.Button disabled={!urlField.validity} onClick={onContinue}>
                        Continue to login
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
