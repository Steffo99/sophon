import {Box, BringAttention as B, Heading, ListUnordered as UL} from "@steffo/bluelib-react"
import * as React from "react"
import {useCacheContext} from "../../contexts/cache"


export function CacheStatsBox(): JSX.Element | null {
    const cache = useCacheContext()

    if(!cache) {
        return null
    }
    if(!cache.users) {
        return null
    }
    if(!cache.users.resources) {
        return null
    }

    return (
        <Box>
            <Heading level={3}>
                Instance stats
            </Heading>
            <UL>
                <UL.Item>This instance has <B>{cache.users.resources.length}</B> registered users.</UL.Item>
            </UL>
        </Box>
    )
}
