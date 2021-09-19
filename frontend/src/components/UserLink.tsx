import * as React from "react"
import * as ReactDOM from "react-dom"
import {User, UserId} from "../types";
import {Anchor} from "@steffo/bluelib-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner, faTimesCircle, faUser} from "@fortawesome/free-solid-svg-icons";
import {useDRFViewSet} from "../hooks/useDRF";
import {Link} from "@reach/router";


interface UserLinkProps {
    id: UserId,
}


export function UserLink({id}: UserLinkProps): JSX.Element {
    const {retrieve} = useDRFViewSet<User>("/api/core/users/")

    const [user, setUser] = React.useState<User | null>(null)
    const [error, setError] = React.useState<Error | null>(null)

    React.useEffect(
        () => {
            const abort = new AbortController()
            retrieve(id.toString(), {signal: abort.signal}).then(u => setUser(u))

            return () => {
                abort.abort()
            }
        },
        [retrieve, setUser]
    )

    // FIXME: use proper bluelib Anchors

    if(error) return (
        <Link to={`/u/${id}`}>
            <FontAwesomeIcon icon={faTimesCircle}/> {id}
        </Link>
    )
    else if(!user) return (
        <Link to={`/u/${id}`}>
            <FontAwesomeIcon icon={faSpinner} pulse={true}/> {id}
        </Link>
    )
    return (
        <Link to={`/u/${id}`}>
            <FontAwesomeIcon icon={faUser}/> {user.username}
        </Link>
    )
}
