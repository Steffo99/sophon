import {Box, BringAttention as B, Heading, ListUnordered as UL} from "@steffo/bluelib-react"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"


export function InstanceStatsBox(): JSX.Element | null {
    const instance = useInstanceContext()

    if(!instance) {
        return null
    }
    if(!instance.state.users) {
        return null
    }

    return (
        <Box>
            <Heading level={3}>
                Instance stats
            </Heading>
            <UL>
                <UL.Item>This instance has <B>{instance.state.users.length}</B> registered users.</UL.Item>
            </UL>
        </Box>
    )
}
