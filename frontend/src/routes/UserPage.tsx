import * as React from "react"
import * as ReactDOM from "react-dom"
import {UserBox} from "../components/UserBox";


interface UserPageProps {
    pk: string,
}


export function UserPage({pk}: UserPageProps): JSX.Element {
    return (
        <div>
            <UserBox pk={pk}/>
        </div>
    )
}
