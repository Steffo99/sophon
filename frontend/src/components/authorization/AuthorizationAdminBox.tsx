import {navigate} from "@reach/router"
import {Box, Form, Heading, Idiomatic as I} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useInstanceContext} from "../../contexts/instance"


export function AuthorizationAdminBox(): JSX.Element {
    const instance = useInstanceContext()
    const authorization = useAuthorizationContext()

    const canAdministrate =
        React.useMemo(
            () => (
                authorization !== undefined && !authorization.state.running
            ),
            [authorization],
        )

    const doAdministrate =
        React.useCallback(
            async () => {
                if(!instance) {
                    return
                }
                if(!instance.state.url) {
                    return
                }

                await navigate(`${instance.state.url}admin`)
            },
            [instance],
        )


    return (
        <Box disabled={!canAdministrate}>
            <Heading level={3}>
                Site administration
            </Heading>
            <p>
                To configure the Sophon server, an account with <I>superuser</I> access is required.
            </p>
            <p>
                If you are the server administrator, please refer to the Sophon manual for details on how to acquire the credentials for this account.
            </p>
            <Form>
                <Form.Row>
                    <Form.Button disabled={!canAdministrate} onClick={doAdministrate}>
                        Administrate
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}
