import {Box, Heading, Idiomatic, ListUnordered} from "@steffo/bluelib-react"
import * as React from "react"
import {useCacheContext} from "../../contexts/cache"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"


export interface GroupMembersBoxProps {
    resource: ManagedResource<SophonResearchGroup>
}


export function GroupMembersBox({resource}: GroupMembersBoxProps): JSX.Element | null {
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

        return (
            <ListUnordered.Item bluelibClassNames={index === 0 ? "color-blue" : ""} key={id}>
                {user.value.username}
            </ListUnordered.Item>
        )
    })

    return (
        <Box>
            <Heading level={3}>
                Members of <Idiomatic>{resource.value.name}</Idiomatic>
            </Heading>
            <ListUnordered>
                {users}
            </ListUnordered>
        </Box>
    )
}