import {faUser} from "@fortawesome/free-solid-svg-icons"
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {SophonToken, SophonUser} from "../../types/SophonTypes"
import {Validators} from "../../utils/Validators"
import {IconText} from "../elements/IconText"
import {useInstanceAxios} from "../instance/useInstanceAxios"


export function AuthorizationLoginBox(): JSX.Element {
    const axios = useInstanceAxios()
    const authorization = useAuthorizationContext()

    const [error, setError] = React.useState<Error | undefined>(undefined)

    const username = useFormState<string>("", Validators.doNotValidate)
    const password = useFormState<string>("", Validators.doNotValidate)

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
                if(error) {
                    return "color-red"
                }
                return ""
            },
            [authorization, error],
        )

    return (
        <Box disabled={!canLogin}>
            <Heading level={3}>
                <IconText icon={faUser}>
                    Login
                </IconText>
            </Heading>
            <p>
                To use most features of Sophon, an account is required.
            </p>
            <p>
                If you do not have one, you can ask your system administrator to create one for you.
            </p>
            <Form>
                <Form.Field
                    label={"Username"}
                    placeholder={"enfer"}
                    required={true}
                    disabled={!canLogin}
                    {...username}
                />
                <Form.Field
                    label={"Password"}
                    type={"password"}
                    placeholder={"••••••••••"}
                    required={true}
                    disabled={!canLogin}
                    {...password}
                />
                <Form.Row>
                    <Form.Button type={"submit"} bluelibClassNames={buttonColor} disabled={!canClickLogin} onClick={doLogin}>
                        <IconText icon={faUser} spin={authorization?.state.running}>
                            Login
                        </IconText>
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
