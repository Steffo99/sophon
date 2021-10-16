import {faUser as faUserRegular} from "@fortawesome/free-regular-svg-icons"
import {faClipboardCheck, faUser as faUserSolid} from "@fortawesome/free-solid-svg-icons"
import {Box, BringAttention as B, Form, Heading} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {IconText} from "../elements/IconText"
import {AuthorizationGoToSophonButton} from "./AuthorizationGoToSophonButton"
import {AuthorizationLogoutButton} from "./AuthorizationLogoutButton"


export function AuthorizationLoggedInBox(): JSX.Element {
    const authorization = useAuthorizationContext()

    const loggedUsername = React.useMemo(
        () => {
            if(!authorization?.state.user) {
                return (
                    <B>
                        <IconText icon={faUserRegular}>
                            a guest
                        </IconText>
                    </B>
                )
            }
            else {
                return (
                    <B>
                        <IconText icon={faUserSolid}>
                            {authorization.state.user.username}
                        </IconText>
                    </B>
                )
            }
        },
        [authorization],
    )

    return (
        <Box>
            <Heading level={3}>
                <IconText icon={faClipboardCheck}>
                    Logged in
                </IconText>
            </Heading>
            <p>
                You are currently logged in as {loggedUsername}.
            </p>
            <Form>
                <Form.Row>
                    <AuthorizationGoToSophonButton/>
                </Form.Row>
            </Form>
            <p>
                To use a different account with Sophon, you'll need to logout from your current one first.
            </p>
            <Form>
                <Form.Row>
                    <AuthorizationLogoutButton/>
                </Form.Row>
            </Form>
        </Box>
    )
}
