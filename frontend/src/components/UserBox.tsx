import * as React from "react"
import * as ReactDOM from "react-dom"
import {useDRFManagedDetail} from "../hooks/useDRF";
import {Loading} from "./Loading";
import {Box, Heading, BringAttention as B, Idiomatic as I, Anchor} from "@steffo/bluelib-react";
import {User} from "../types";
import {useInstance} from "./InstanceContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";


interface UserBoxProps {
    pk: string,
}


export function UserBox({pk}: UserBoxProps): JSX.Element {
    const instance = useInstance()
    const user = useDRFManagedDetail<User>(`/api/core/users/`, pk)

    if(!user.resource) {
        return (
            <Box>
                <Loading/>
            </Box>
        )
    }

    return (
        <Box>
            <Heading level={3}>
                {user.resource.username}
            </Heading>
            <p>
                <B>{user.resource.first_name ? `${user.resource.first_name} ${user.resource.last_name}` : user.resource.username}</B> is an user registered at <I>{instance.details!.name}</I>.
            </p>
            {user.resource.email ?
                <p>
                    <Anchor href={`mailto:${user.resource.email}`}>
                        <FontAwesomeIcon icon={faEnvelope}/> Send email
                    </Anchor>
                </p>
            : null}
        </Box>
    )
}
