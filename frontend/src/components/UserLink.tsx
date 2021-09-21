import * as React from "react"
import {User, UserId} from "../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner, faTimesCircle, faUser} from "@fortawesome/free-solid-svg-icons";
import {useDRFViewSet} from "../hooks/useDRF";
import {Link} from "./Link";


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
            retrieve(id.toString(), {signal: abort.signal})
                .then(u => setUser(u))
                .catch(e => setError(e as Error))

            return () => {
                abort.abort()
            }
        },
        [retrieve, setUser, id]
    )

    if(error) return (
        <Link href={`/u/${id}`} title={id.toString()}>
            <FontAwesomeIcon icon={faTimesCircle}/> {id}
        </Link>
    )
    else if(!user) return (
        <Link href={`/u/${id}`} title={id.toString()}>
            <FontAwesomeIcon icon={faSpinner} pulse={true}/> {id}
        </Link>
    )
    return (
        <Link href={`/u/${id}`} title={id.toString()}>
            <FontAwesomeIcon icon={faUser}/> {user.username}
        </Link>
    )
}