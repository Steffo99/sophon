import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {SophonToken, SophonUser} from "../../types/SophonTypes"
import {Loading} from "../elements/Loading"
import {useInstanceAxios} from "../instance/useInstanceAxios"


export function AuthorizationLoginBox(): JSX.Element {
    const axios = useInstanceAxios()
    const authorization = useAuthorizationContext()

    const [error, setError] = React.useState<Error | undefined>(undefined)

    const username = useFormState<string>("", () => undefined)
    const password = useFormState<string>("", () => undefined)

    const canLogin =
        React.useMemo<boolean>(
            () => (
                axios !== undefined && authorization !== undefined && authorization.state.token === undefined
            ),
            [axios, authorization],
        )

    const canClickLogin =
        React.useMemo<boolean>(
            () => (
                canLogin && !authorization!.state.running && username.value !== "" && password.value !== ""
            ),
            [authorization, canLogin, username, password],
        )

    const doLogin =
        React.useCallback(
            async () => {
                if(!axios) {
                    return
                }
                if(!authorization) {
                    return
                }

                authorization.dispatch({
                    type: "start:login",
                })
                setError(undefined)
                try {
                    const loginRequest = await axios.post<SophonToken>("/api/auth/token/", {username: username.value, password: password.value})
                    const dataRequest = await axios.get<SophonUser>(`/api/core/users/${username.value}/`)
                    authorization.dispatch({
                        type: "success:login",
                        user: dataRequest.data,
                        token: loginRequest.data.token,
                    })
                }
                catch(e) {
                    setError(e as Error)
                    authorization.dispatch({
                        type: "failure:login",
                    })
                    return
                }
            },
            [axios, authorization, username, password],
        )

    const buttonColor =
        React.useMemo<string>(
            () => {
                if(!authorization) {
                    return ""
                }
                if(authorization.state.running) {
                    return "color-yellow"
                }
                if(error) {
                    return "color-red"
                }
                return ""
            },
            [authorization, error],
        )

    const buttonText =
        React.useMemo<JSX.Element | null>(
            () => {
                if(authorization?.state.running) {
                    return <Loading text={"Logging in..."}/>
                }
                if(error) {
                    return <><FontAwesomeIcon icon={faExclamationCircle}/>&nbsp;Login</>
                }
                return <>Login</>
            },
            [error, authorization],
        )

    return (
        <Box disabled={!canLogin}>
            <Heading level={3}>
                Login
            </Heading>
            <p>
                To use most features of Sophon, an account is required.
            </p>
            <p>
                If you do not have one, you can ask your system administrator to create one for you.
            </p>
            <Form>
                <Form.Field label={"Username"} required disabled={!canLogin} {...username}/>
                <Form.Field label={"Password"} type={"password"} required disabled={!canLogin} {...password}/>
                <Form.Row>
                    <Form.Button type={"submit"} bluelibClassNames={buttonColor} disabled={!canClickLogin} onClick={doLogin}>
                        {buttonText}
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
