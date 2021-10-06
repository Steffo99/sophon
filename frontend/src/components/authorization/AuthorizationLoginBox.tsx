import {faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {navigate} from "@reach/router"
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {SophonToken, SophonUser} from "../../types/SophonTypes"
import {Loading} from "../elements/Loading"
import {ErrorBox} from "../errors/ErrorBox"
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
                axios !== undefined && authorization !== undefined && !authorization.state.running && authorization.state.token === undefined
            ),
            [axios, authorization, username, password],
        )

    const canClickLogin =
        React.useMemo<boolean>(
            () => (
                canLogin && username.value !== "" && password.value !== ""
            ),
            [canLogin, username, password],
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

                await navigate("l/")
            },
            [axios, authorization, username, password],
        )

    const messagePanel =
        React.useMemo<JSX.Element | null>(
            () => {
                if(!authorization) {
                    return <ErrorBox error={new Error("This component is being rendered outside an AuthorizationContext.")}/>
                }
                if(error) {
                    return <ErrorBox error={error}/>
                }
                if(authorization.state.running) {
                    return <Box bluelibClassNames={"color-yellow"}><Loading text={"Logging in..."}/></Box>
                }
                return (
                    <Box><FontAwesomeIcon icon={faInfoCircle}/> Press the login button after inserting your credentials.</Box>
                )
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
                <Form.Row>
                    {messagePanel}
                </Form.Row>
                <Form.Field label={"Username"} required {...username}/>
                <Form.Field label={"Password"} type={"password"} required {...password}/>
                <Form.Row>
                    <Form.Button type={"submit"} disabled={!canClickLogin} onClick={doLogin}>
                        Login
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
