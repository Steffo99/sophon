import {faCog} from "@fortawesome/free-solid-svg-icons"
import {Box, Form, Heading, Idiomatic as I} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {IconText} from "../elements/IconText"
import {AuthorizationAdminPageButton} from "./AuthorizationAdminPageButton"


/**
 * Box that allows the user to access the Sophon administration page.
 *
 * @constructor
 */
export function AuthorizationAdminBox(): JSX.Element {
    const authorization = useAuthorizationContext()

    const enabled =
        React.useMemo(
            () => authorization && !authorization.state.running && authorization.state.token === undefined,
            [authorization],
        )

    return (
        <Box disabled={!enabled}>
            <Heading level={3}>
                <IconText icon={faCog}>
                    Server administration
                </IconText>
            </Heading>
            <p>
                To configure the Sophon server, an account with <I>superuser</I> access is required.
            </p>
            <p>
                If you are the server administrator, please refer to the Sophon manual for details on how to acquire the credentials for this account.
            </p>
            <Form>
                <Form.Row>
                    <AuthorizationAdminPageButton disabled={!enabled}/>
                </Form.Row>
            </Form>
        </Box>
    )
}
