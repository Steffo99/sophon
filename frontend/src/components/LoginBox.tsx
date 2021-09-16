import * as React from "react"
import {navigate} from "@reach/router";
import {Box, Form, Heading, Idiomatic as I, Panel, useFormState} from "@steffo/bluelib-react"
import {useLogin} from "./LoginContext";
import {useInstance} from "./InstanceContext";
import {FormState} from "@steffo/bluelib-react/dist/hooks/useFormState";
import {AxiosError} from "axios-lab";


interface LoginBoxProps {

}


export function LoginBox({}: LoginBoxProps): JSX.Element {
    /**
     * The {@link InstanceContext}.
     */
    const instance = useInstance()

    /**
     * The {@link LoginContext}.
     */
    const {login, running} = useLogin()

    /**
     * The {@link FormState} of the username field.
     */
    const username = useFormState<string>("", value => {
        if(value === "") return undefined
        return true
    })

    /**
     * The {@link FormState} of the password field.
     */
    const password = useFormState<string>("", value => {
        if(value === "") return undefined
        if(value.length < 8) return false
        return true
    })

    /**
     * The last {@link Error} occoured during the login request.
     */
    const [error, setError] = React.useState<AxiosError | null>(null)

    /**
     * An {@link AbortController} used to abort the login request.
     */
    const [abort, setAbort] = React.useState<AbortController | null>(null)

    /**
     * The function to perform the login.
     */
    const doLogin = React.useCallback(
        async () => {
            // Abort the previous login request
            if(abort) abort.abort()

            // Create a new AbortController
            const newAbort = new AbortController()
            setAbort(newAbort)

            // Clear any previous errors
            setError(null)

            // Try to login
            try {
                await login(username.value, password.value, newAbort.signal)
            }
            catch (e: unknown) {
                // Store the caught error
                setError(e as AxiosError)
                return
            }

            await navigate("/logged-in")
        },
        [abort, setAbort, username, password, login, setError]
    )

    /**
     * Whether the login button is enabled or not.
     */
    const canLogin = React.useMemo<boolean>(
        () => {
            return instance.validity === true && username.validity === true && password.validity === true && !running
        },
        [instance, username, password, running]
    )

    /**
     * The state panel, displayed on top of the form.
     */
    const statePanel = React.useMemo(
        () => {
            if(error) {
                if(error.response) {
                    return (
                        <Panel bluelibClassNames={"color-red"}>
                            <I>{error.response.statusText}</I>: {error.response.data['non_field_errors'][0]}
                        </Panel>
                    )
                }
                else {
                    return (
                        <Panel bluelibClassNames={"color-red"}>
                            {error.toString()}
                        </Panel>
                    )
                }
            }
            if(!instance.validity) {
                return (
                    <Panel bluelibClassNames={"color-red"}>
                        Please enter a valid instance URL before logging in.
                    </Panel>
                )
            }
            if(!(username.validity && password.validity)) {
                return (
                    <Panel>
                        Please enter your login credentials.
                    </Panel>
                )
            }
            if(running) {
                return (
                    <Panel bluelibClassNames={"color-cyan"}>
                        Logging in, please wait...
                    </Panel>
                )
            }
            return (
                <Panel>
                    Click the button below to login.
                </Panel>
            )
        },
        [error, instance, username, password, running]
    )

    return (
        <Box>
            <Heading level={3}>
                Login
            </Heading>
            <p>
                Login as an authorized user to access the full functionality of Sophon.
            </p>
            <Form>
                <Form.Row>
                    {statePanel}
                </Form.Row>
                <Form.Field label={"Username"} {...username} disabled={!instance.validity}/>
                <Form.Field label={"Password"} type={"password"} {...password} disabled={!instance.validity}/>
                <Form.Row>
                    <Form.Button onClick={doLogin} disabled={!canLogin} bluelibClassNames={error ? "color-red" : ""}>
                        Login
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
