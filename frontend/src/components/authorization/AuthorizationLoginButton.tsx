import {faUser} from "@fortawesome/free-solid-svg-icons"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {CanBeDisabled} from "../../types/ExtraTypes"
import {SophonToken, SophonUser} from "../../types/SophonTypes"
import {IconText} from "../elements/IconText"
import {useInstanceAxios} from "../instance/useInstanceAxios"


export interface AuthorizationLoginButtonProps extends CanBeDisabled {
    username: string,
    password: string,
}


export function AuthorizationLoginButton({username, password, disabled = false}: AuthorizationLoginButtonProps): JSX.Element {
    const authorization = useAuthorizationContext()
    const axios = useInstanceAxios()

    const [error, setError] = React.useState<Error | undefined>(undefined)

    const canLogin =
        React.useMemo<boolean>(
            () => (
                !disabled && authorization !== undefined && !authorization.state.running && username !== "" && password !== ""
            ),
            [disabled, authorization, username, password],
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
                    const loginRequest = await axios.post<SophonToken>("/api/auth/token/", {username, password})
                    const dataRequest = await axios.get<SophonUser>(`/api/core/users/${username}/`)
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

    return (
        <Button type={"submit"} builtinColor={error ? "red" : undefined} disabled={!canLogin} onClick={doLogin}>
            <IconText icon={faUser} spin={authorization?.state.running}>
                Login
            </IconText>
        </Button>
    )
}
