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

    return (
        <Box>
            <Heading level={3}>
                Members of <Idiomatic>{resource.value.name}</Idiomatic>
            </Heading>
            <ListUnordered>
                {trueMembers.map((id, index) => (
                    <ListUnordered.Item bluelibClassNames={index === 0 ? "color-blue" : ""} key={id}>
                        {cache.getUserById(id)!.value.username}
                    </ListUnordered.Item>
                ))}
            </ListUnordered>
        </Box>
    )
}
