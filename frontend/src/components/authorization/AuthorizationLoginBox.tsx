import {faUser} from "@fortawesome/free-solid-svg-icons"
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {Validators} from "../../utils/Validators"
import {IconText} from "../elements/IconText"
import {useInstanceAxios} from "../instance/useInstanceAxios"
import {AuthorizationLoginButton} from "./AuthorizationLoginButton"


export function AuthorizationLoginBox(): JSX.Element {
    const axios = useInstanceAxios()
    const authorization = useAuthorizationContext()

    const username = useFormState<string>("", Validators.doNotValidate)
    const password = useFormState<string>("", Validators.doNotValidate)

    const canLogin =
        React.useMemo<boolean>(
            () => (
                authorization !== undefined && authorization.state.token === undefined
            ),
            [axios, authorization],
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
                    <AuthorizationLoginButton
                        disabled={!canLogin}
                        username={username.value}
                        password={password.value}
                    />
                </Form.Row>
            </Form>
        </Box>
    )
}
