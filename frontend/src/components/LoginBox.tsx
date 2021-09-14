import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, Parenthesis} from "@steffo/bluelib-react";
import {useSophonContext} from "../utils/SophonContext";
import {useFormProps} from "../hooks/useValidatedState";


interface LoginBoxProps {

}


export function LoginBox({...props}: LoginBoxProps): JSX.Element {
    const {loginData, loginError, login, logout} = useSophonContext()

    const username
        = useFormProps("",
            val => {
                if(val === "") {
                    return null
                }
                return true
            }
        )
    const password
        = useFormProps("",
            val => {
                if(val === "") {
                    return null
                }
                return true
            }
        )


    if(loginData) {
        return (
            <Box>
                <Heading level={3}>
                    Login
                </Heading>
                <Form>
                    <Form.Row>
                        You are logged in as: {loginData.username}
                    </Form.Row>
                    <Form.Row>
                        <Form.Button onClick={logout}>Logout</Form.Button>
                    </Form.Row>
                </Form>
            </Box>
        )
    }
    else {
        return (
            <Box>
                <Heading level={3}>
                    Login
                </Heading>
                <Form>
                    {loginError ?
                        <Form.Row>
                            <Parenthesis bluelibClassNames={"color-red"}>
                                {loginError.toString()}
                            </Parenthesis>
                        </Form.Row>
                    : null}
                    <Form.Field label={"Username"} {...username}/>
                    <Form.Field label={"Password"} type={"password"} {...password}/>
                    <Form.Row>
                        <Form.Button onClick={() => login(username.value, password.value)} bluelibClassNames={loginError ? "color-red" : ""}>
                            Login
                        </Form.Button>
                    </Form.Row>
                </Form>
            </Box>
        )
    }
}
