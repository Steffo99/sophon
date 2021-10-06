import {faUser as faUserRegular} from "@fortawesome/free-regular-svg-icons"
import {faExclamationCircle, faTimesCircle, faUser as faUserSolid} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Form, Heading, Idiomatic as I} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"


export interface AuthorizationLogoutBoxProps {

}


export function AuthorizationLogoutBox({}: AuthorizationLogoutBoxProps): JSX.Element {
    const authorization = useAuthorizationContext()

    const loggedUsername = React.useMemo(
        () => {
            if(!authorization) {
                return <I bluelibClassNames={"color-red"}>
                    <FontAwesomeIcon icon={faExclamationCircle}/> Not in a AuthorizationContext
                </I>
            }
            else if(authorization.state.user === undefined) {
                return <I bluelibClassNames={"color-red"}>
                    <FontAwesomeIcon icon={faTimesCircle}/> Not logged in
                </I>
            }
            else if(authorization.state.user === null) {
                return <I>
                    <FontAwesomeIcon icon={faUserRegular}/> a guest
                </I>
            }
            else {
                return <I>
                    <FontAwesomeIcon icon={faUserSolid}/> {authorization.state.user.username}
                </I>
            }
        },
        [authorization],
    )

    const canLogout = React.useMemo(
        () => (
            authorization !== undefined && authorization.state.user !== undefined && !authorization.state.running
        ),
        [authorization],
    )

    const doLogout = React.useCallback(
        () => {
            if(!authorization) {
                return
            }

            authorization.dispatch({
                type: "clear",
            })
        },
        [authorization],
    )

    return (
        <Box disabled={!canLogout}>
            <Heading level={3}>
                Logout
            </Heading>
            <p>
                To use a different account with Sophon, you'll need to logout from your current one first.
            </p>
            <p>
                You are currently logged in as {loggedUsername}.
            </p>
            <Form>
                <Form.Row>
                    <Form.Button disabled={!canLogout} onClick={doLogout}>
                        Logout
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}