import * as React from "react"
import {useState} from "react"
import {useSophonAxios} from "../instance/useSophonAxios";
import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import {useLogin} from "./useLogin";
import {DjangoUser, LoginResponse} from "../../types/DjangoTypes";
import {ErrorBox} from "../errors/ErrorBox";
import {Loading} from "../elements/Loading";


export interface LoginFormBoxProps {

}


export function LoginFormBox({}: LoginFormBoxProps): JSX.Element {
    const axios = useSophonAxios()
    const login = useLogin()

    const [running, setRunning] = useState<boolean>(false)
    const [error, setError] = useState<Error | undefined>(undefined)

    const username = useFormState<string>("", () => undefined)
    const password = useFormState<string>("", () => undefined)

    const canLogin =
        React.useMemo<boolean>(
            () => (axios !== undefined && !running),
            [axios, running]
        )

    const doLogin =
        React.useCallback(
            async () => {
                if (!axios) return

                setRunning(true)
                setError(undefined)
                try {
                    const auth = await axios.post<LoginResponse>("/api/auth/token/", {username: username.value, password: password.value})
                    const data = await axios.get<DjangoUser>(`/api/core/users/${username.value}/`)
                    login.dispatch({
                        type: "login",
                        user: data.data,
                        token: auth.data.token,
                    })
                } catch (e) {
                    setError(e as Error)
                } finally {
                    setRunning(false)
                }
            },
            [axios, login]
        )

    const messagePanel =
        React.useMemo<JSX.Element | null>(
            () => {
                if (error) {
                    return <ErrorBox error={error}/>
                }
                if (running) {
                    return <Box bluelibClassNames={"color-yellow"}><Loading text={"Logging in..."}/></Box>
                }
                return (
                    <Box>Press the login button after inserting your credentials.</Box>
                )
            },
            [error]
        )

    return (
        <Box>
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
                <Form.Field label={"Username"} {...username}/>
                <Form.Field label={"Password"} type={"password"} {...password}/>
                <Form.Row>
                    <Form.Button type={"submit"} disabled={!canLogin} onClick={doLogin}>
                        Login
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
