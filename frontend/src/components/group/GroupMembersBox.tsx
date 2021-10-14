import {faUsersCog} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Heading, Idiomatic, ListUnordered, UAnnotation} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useCacheContext} from "../../contexts/cache"
import {useGroupContext} from "../../contexts/group"


export function GroupMembersBox(): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const cache = useCacheContext()
    const group = useGroupContext()

    if(!cache) {
        return null
    }
    if(!cache.users) {
        return null
    }
    if(!group) {
        return null
    }

    const trueMembers = [...new Set([group.value.owner, ...group.value.members])]

    const users = trueMembers.map((id, index) => {
        const user = cache.getUserById(id)

        if(!user) {
            return null
        }

        const username = id === authorization?.state.user?.id ? <UAnnotation>{user.value.username}</UAnnotation> : user.value.username

        return (
            <ListUnordered.Item bluelibClassNames={index === 0 ? "color-blue" : ""} key={id}>
                {username}
            </ListUnordered.Item>
        )
    })

    return (
        <Box>
            <Heading level={3}>
                <FontAwesomeIcon icon={faUsersCog}/> Members of <Idiomatic>{group.value.name}</Idiomatic>
            </Heading>
            <ListUnordered>
                {users}
            </ListUnordered>
        </Box>
    )
}
