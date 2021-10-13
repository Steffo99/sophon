import {faUsersCog} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Heading, Idiomatic, ListUnordered, UAnnotation} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useCacheContext} from "../../contexts/cache"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"


export interface GroupMembersBoxProps {
    resource: ManagedResource<SophonResearchGroup>
}


export function GroupMembersBox({resource}: GroupMembersBoxProps): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const cache = useCacheContext()

    if(!cache) {
        return null
    }
    if(!cache.users) {
        return null
    }

    const trueMembers = [...new Set([resource.value.owner, ...resource.value.members])]

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
                <FontAwesomeIcon icon={faUsersCog}/> Members of <Idiomatic>{resource.value.name}</Idiomatic>
            </Heading>
            <ListUnordered>
                {users}
            </ListUnordered>
        </Box>
    )
}
