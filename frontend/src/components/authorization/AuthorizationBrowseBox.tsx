import {faLock, faUniversity} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Form, Heading, Idiomatic as I} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"


export function AuthorizationBrowseBox(): JSX.Element {
    const authorization = useAuthorizationContext()

    const canBrowse =
        React.useMemo(
            () => (
                authorization !== undefined && !authorization.state.running && authorization.state.token === undefined
            ),
            [authorization],
        )

    const doBrowse =
        React.useCallback(
            async () => {
                if(!authorization) {
                    return
                }

                authorization.dispatch({
                    type: "browse",
                })
            },
            [authorization],
        )

    return (
        // By disabling the box, the login box is highlighted while a login attempt is running, making the user focus on the login attempt
        <Box disabled={!canBrowse}>
            <Heading level={3}>
                Browse as guest
            </Heading>
            <p>
                You can browse Sophon without an account.
            </p>
            <p>
                You won't be able to interact with the resources, and you won't see <I><FontAwesomeIcon icon={faUniversity}/> Internal</I> and <I><FontAwesomeIcon icon={faLock}/> Private</I> projects.
            </p>
            <Form>
                <Form.Row>
                    <Form.Button disabled={!canBrowse} onClick={doBrowse}>
                        Browse
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
