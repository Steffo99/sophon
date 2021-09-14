import * as React from "react"
import * as ReactDOM from "react-dom"
import {Box, Heading, Form, Parenthesis, Variable, useFormState} from "@steffo/bluelib-react";
import {useSophonContext} from "../utils/SophonContext";


interface LoginBoxProps {

}


export function LoginBox({...props}: LoginBoxProps): JSX.Element {
    const {loginData, loginError, login, logout} = useSophonContext()

    const username
        = useFormState("",
            val => {
                if(val === "") {
                    return undefined
                }
                return true
            }
        )
    const password
        = useFormState("",
            val => {
                if(val === "") {
                    return undefined
                }
                if(val.length < 8) {
                    return false
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
                <p>
                    You are logged in as: <Variable>{loginData.username}</Variable>
                </p>
                <Form>
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
                <p>
                    Login to the Sophon instance to access the full capabilities of Sophon.
                </p>
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
                        <Form.Button disabled={!(username.validity && password.validity)} onClick={() => login(username.value, password.value)} bluelibClassNames={loginError ? "color-red" : ""}>
                            Login
                        </Form.Button>
                    </Form.Row>
                </Form>
            </Box>
        )
    }
}
