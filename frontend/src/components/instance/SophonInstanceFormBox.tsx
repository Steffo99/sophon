import * as React from "react"
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react";
import Axios from "axios-lab"
import {CHECK_TIMEOUT_MS} from "../../constants";
import {SophonInstanceDetails} from "../../types/SophonTypes";
import {Validator} from "@steffo/bluelib-react/dist/types";
import {useSophonInstance} from "./useSophonInstance";
import {navigate} from "@reach/router";
import {InstanceEncoder} from "../../utils/InstanceEncoder";


/**
 * {@link Box} which allows the user to input the Sophon instance to use, altering the {@link SophonInstanceState} in the process.
 *
 * Additionally displays a button to proceed
 *
 * @constructor
 */
export function SophonInstanceFormBox(): JSX.Element {
    const instance = useSophonInstance()

    const onValidate =
        React.useCallback<Validator<string>>(
            async (value, signal) => {
                // Don't check if the instance is not a valid url
                if (value === "") {
                    return undefined
                }

                // Display an error if an invalid URL is entered
                let url = new URL(value)

                // Wait for a small timeout before checking
                await new Promise(r => setTimeout(r, CHECK_TIMEOUT_MS))

                // If the validation was aborted, it means another check is currently running, so display running
                if (signal.aborted) return null

                // Try to get the instance data from the backend
                const response = await Axios.get<SophonInstanceDetails>("/api/core/instance", {baseURL: url.toString(), signal})

                // Awaits should always be followed by abort checks
                if (signal.aborted) return null

                // If the response is successful, update the info about the current instance
                instance.setDetails({...response.data, url})

                // Success!
                return true
            },
            [instance]
        )

    const onContinue =
        React.useCallback(
            () => {
                if (!instance.url) return undefined
                const url = InstanceEncoder.encode(instance.url)
                // noinspection JSIgnoredPromiseFromCall
                navigate(`/i/${url}/`)
            },
            [instance]
        )

    const urlField =
        useFormState<string>(instance.url?.toString() ?? "", onValidate)

    return (
        <Box>
            <Heading level={3}>
                Instance select
            </Heading>
            <p>
                Sophon can be used by multiple institutions, each one using a physically separate instance, allowing them to stay in control of their data.
            </p>
            <Form>
                <Form.Field label={"URL"} {...urlField}/>
                <Form.Row>
                    <Form.Button disabled={!urlField.validity} onClick={onContinue}>
                        Continue to login
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
